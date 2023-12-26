// inventoryUsageController.js
const express = require("express");
const router = express.Router();
const Util = require("../utilities");
const inventoryUsageModel = require("../models/inventoryUsageModel");
const inventoryUsageController = {};

/***********************************************
 * Show the inventory usage form
 ***********************************************/
inventoryUsageController.showInventoryUsageForm = async (req, res) => {
    try {
        const nav = await Util.getNav();
        let medications;

        if (req.query.medication_search) {
            medications = await inventoryUsageModel.getMatchingMedications(req.query.medication_search);
        } else {
            medications = await inventoryUsageModel.getAllMedications();
        }

        res.render("inventory-usage", {
            title: "Record Inventory Usage",
            nav,
            messages: req.flash(),
            medications,
            currentDate: Util.getCurrentDate(),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

/***********************************************
 * Record inventory usage
 ***********************************************/
inventoryUsageController.recordInventoryUsage = async (req, res) => {
    try {
        const { medication_id, total_units, total_scripts, usage_date } = req.body;

        const result = await inventoryUsageModel.recordUsage(
            medication_id,
            total_units,
            total_scripts,
            usage_date
        );

        if (result) {
            req.flash("success", "Inventory usage recorded successfully.");
            res.redirect("/inventory-usage");
        } else {
            req.flash("error", "Failed to record inventory usage.");
            res.redirect("/inventory-usage");
        }
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to record inventory usage.");
        res.redirect("/inventory-usage");
    }
};

module.exports = inventoryUsageController;
