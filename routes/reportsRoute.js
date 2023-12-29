const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");

// Display the reports form
router.get("/reports", reportsController.deliverReportsView);

// Display the by medication reports form
router.get("/by-medication-view", reportsController.deliverByMedicationView);

// Display the by medication reports form
router.get("/by-date-view", reportsController.deliverByDateView);

// Display the by medication report results
router.post("/by-medication-result", reportsController.generateByMedicationResult);

// Display the by medication report results
router.post("/by-date-result", reportsController.generateByDateResult);

module.exports = router;