// incomingInventoryRoute.js
const express = require("express");
const router = express.Router();
const incomingInventoryController = require("../controllers/incomingInventoryController");

// Define the GET route for displaying the incoming inventory form
router.get("/", incomingInventoryController.showIncomingInventoryForm);

// Define the POST route for handling incoming inventory
router.post("/", incomingInventoryController.handleIncomingInventory);

module.exports = router;
