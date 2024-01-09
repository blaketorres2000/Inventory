const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");

// Display the reports form
router.get("/reports", reportsController.deliverReportsView);

// Display the by medication reports form
router.get("/by-medication-view", reportsController.deliverByMedicationView);

// Display the by date reports form
router.get("/by-date-view", reportsController.deliverByDateView);

// Display the by class reports form
router.get("/by-class-view", reportsController.deliverByClassView);

// Display the by medication report results
router.post("/by-medication-result", reportsController.generateByMedicationResult);

// Display the by date report results
router.post("/by-date-result", reportsController.generateByDateResult);

// Display the by class report results
router.post("/by-class-result", reportsController.generateByClassResult);

// Display medications that fall below the minimum threshold
router.get("/threshold-report", reportsController.deliverMedsBelowThreshold);

// Display the medication comparison report form
router.get("/compare-medications", reportsController.compareMedications);

// Generate medication comparison report results
router.post("/compare-medications-result", reportsController.generateMedicationComparisonResult);

module.exports = router;