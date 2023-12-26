const Util = require("../utilities");
const incomingInventoryModel = require("../models/incomingInventoryModel");
const incomingInventoryController = {};

/***********************************************
 * Show the incoming inventory form
 ***********************************************/
incomingInventoryController.showIncomingInventoryForm = async (req, res) => {
    try {
        const nav = await Util.getNav();
        let medications;

        if (req.query.medication_search) {
            medications = await incomingInventoryModel.getMatchingMedications(req.query.medication_search);
        } else {
            medications = await incomingInventoryModel.getAllMedications();
        }

        res.render("incoming-inventory", {
            title: "Incoming Inventory",
            nav,
            messages: req.flash(),
            medications,
        });
    } catch (error) {
        console.error('Incoming Inventory Controller - Show Form Error:', error);
        res.status(500).send("Internal Server Error");
    }
};

/***********************************************
 * Handle incoming inventory
 ***********************************************/
incomingInventoryController.handleIncomingInventory = async (req, res) => {
    try {
        const { medication_id, added_inventory } = req.body;

        // Update current inventory
        const updatedInventory = await incomingInventoryModel.handleIncomingInventory(
            medication_id,
            added_inventory
        );

        if (updatedInventory) {
            req.flash("success", "Incoming inventory added successfully.");
            res.redirect("/incoming-inventory");
        } else {
            req.flash("error", "Failed to add incoming inventory.");
            res.redirect("/incoming-inventory");
        }
    } catch (error) {
        console.error('Incoming Inventory Controller - Error:', error);
        req.flash("error", "Failed to add incoming inventory.");
        res.redirect("/incoming-inventory");
    }
};
module.exports = incomingInventoryController;