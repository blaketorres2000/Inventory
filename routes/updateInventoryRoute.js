const express = require("express");
const router = express.Router();
const updateInventoryController = require("../controllers/updateInventoryController");

// Define the GET route for displaying the update inventory form
router.get("/", updateInventoryController.showUpdateInventoryForm);

// Define the POST route for handling the search and update process
router.post("/", updateInventoryController.searchAndUpdate);

module.exports = router;
