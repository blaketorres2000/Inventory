const express = require("express");
const router = express.Router();
const addInventoryController = require("../controllers/addInventoryController");

// Define the GET route for displaying the add inventory form
router.get("/", addInventoryController.addInventoryForm);

router.post("/", addInventoryController.addInventory);

module.exports = router;
