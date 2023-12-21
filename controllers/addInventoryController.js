const express = require("express");
const router = express.Router();
const Util = require("../utilities");
const addInventoryModel = require("../models/addInventoryModel");
const addInventoryController = {};

/***********************************************
 * Deliver the add inventory form
 ***********************************************/
addInventoryController.addInventoryForm = async (req, res) => {
  try {
    // Get the navigation
    const nav = await Util.getNav();

    // Deliver the add inventory form
    res.render("add-inventory", {
      title: "Add New Inventory",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

/***********************************************
 * Process the add inventory form submission
 ***********************************************/
addInventoryController.addInventory = async function (req, res) {
  try {
    const nav = await Util.getNav();

    // Extract form data from req.body
    const {
      medication_name,
      medication_strength,
      control_class,
      current_inventory,
      threshold,
      last_used,
    } = req.body;

    const addResult = await addInventoryModel.addInventory(
      medication_name,
      medication_strength,
      control_class,
      current_inventory,
      threshold,
      last_used
    );

    if (addResult) {
      // If the add was successful, clear the form and display a success message
      req.flash("success", "New inventory added successfully");
      res.redirect("/add-inventory");
    } else {
      req.flash("notice", "Sorry, adding inventory failed.");
      res.status(501).render("add-inventory", {
        title: "Add New Inventory",
        nav,
        errors: req.flash("notice"),
      });
    }
  } catch (error) {
    const nav = await Util.getNav();

    console.error("Error adding inventory", error);
    req.flash("notice", "Sorry, there was an error adding the new inventory.");
    res.status(500).render("/add-inventory", {
      title: "Add New Inventory",
      nav,
      errors: null,
    });
    return;
  }
};

module.exports = addInventoryController;
