const express = require("express");
const router = express.Router();
const inventoryUsageController = require("../controllers/inventoryUsageController");

// Define the GET route for displaying the inventory usage form
router.get("/", inventoryUsageController.showInventoryUsageForm);

// Define the POST route for recording inventory usage
router.post("/", inventoryUsageController.recordInventoryUsage);

module.exports = router;
