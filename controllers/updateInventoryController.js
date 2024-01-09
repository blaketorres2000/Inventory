const express = require("express");
const router = express.Router();
const Util = require("../utilities");
const updateInventoryModel = require("../models/updateInventoryModel");
const updateInventoryController = {};

/***********************************************
 * Show the inventory usage form
 ***********************************************/
updateInventoryController.showUpdateInventoryForm = async (req, res) => {
  try {
    const nav = await Util.getNav();
    let medications;

    if (req.query.medication_search) {
      medications = await updateInventoryModel.getMatchingMedications(
        req.query.medication_search
      );
    } else {
      medications = await updateInventoryModel.getAllMedications();
    }

    res.render("update-inventory", {
      title: "Update Inventory",
      nav,
      messages: req.flash(),
      medications,
      currentDate: Util.getCurrentDate(),
      errors: null,
      medication_name: medications.medication_name,
      medication_strength: medications.medication_strength,
      control_class: medications.control_class,
      current_inventory: medications.current_inventory,
      unit: medications.unit,
      threshold: medications.threshold,
      last_used: medications.last_used,
      Util: Util,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

/***********************************************
 * Search and update medication information
 ***********************************************/
updateInventoryController.searchAndUpdate = async (req, res) => {
  try {
    const {
      medication_id,
      medication_name,
      medication_strength,
      control_class,
      current_inventory,
      unit,
      threshold,
      last_used,
    } = req.body;
    
    // Create a medication object to pass to the update method
    const medication = {
      medication_id,
      medication_name,
      medication_strength,
      control_class,
      current_inventory,
      unit,
      threshold,
      last_used,
    };

    // Update the medication information in the database
    await updateInventoryModel.updateMedication(medication);

    // Redirect to the update inventory page with a success message
    req.flash("success", "Medication updated successfully");
    res.redirect("/update-inventory");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = updateInventoryController;
