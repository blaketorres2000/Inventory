const reportsModel = require("../models/reportsModel");
const Util = require("../utilities");
const reportsController = {};

/***********************************************
 * Render the reports form
 ***********************************************/
reportsController.deliverReportsView = async function (req, res, next) {
  try {
    res.render("reports", {
      title: "Reports",
      errors: null,
    });
  } catch (error) {
    console.log("Error in reports view:", error);
    next(error);
  }
};

/***********************************************
 * Render the by medication reports form
 ***********************************************/
reportsController.deliverByMedicationView = async function (req, res, next) {
  try {
    const nav = await Util.getNav();
    let medications;

    if (req.query.medication_search) {
      medications = await reportsModel.getMatchingMedications(
        req.query.medication_search
      );
    } else {
      medications = await reportsModel.getAllMedications();
    }
    res.render("reports/by-medication-report", {
      title: "By Medication Report",
      nav,
      messages: req.flash(),
      medications,
      currentDate: Util.getCurrentDate(),
      errors: null,
    });
  } catch (error) {
    console.log("Error in by medication view:", error);
    next(error);
  }
};

/***********************************************
 * Generate "By Medication" report results
 ***********************************************/
reportsController.generateByMedicationResult = async function (req, res, next) {
  try {
    const { medication_id, startDate, endDate, reportType } = req.body;

    // Check the reportType and handle the request accordingly
    if (reportType === "by-medication-result") {
      // Fetch report results from the model
      const reportResults = await reportsModel.getByMedicationReport(
        medication_id,
        startDate,
        endDate
      );

      // Calculate report totals
      const reportTotals = reportsModel.calculateReportTotals(reportResults);

      // Render the results in the view
      res.render("reports/by-medication-report", {
        title: "By Medication Report",
        reportResults,
        reportTotals,
        medications: [],
        currentDate: Util.getCurrentDate(),
        errors: null,
      });
    } else {
      // Handle other report types or show an error
      res.status(400).send("Invalid reportType");
    }
  } catch (error) {
    console.log("Error in generateByMedicationResult:", error);
    next(error);
  }
};

/***********************************************
 * Render the "By Date" reports form
 ***********************************************/
reportsController.deliverByDateView = async function (req, res, next) {
  try {
    const nav = await Util.getNav();
    let medications;

    if (req.query.medication_search) {
      medications = await reportsModel.getMatchingMedications(
        req.query.medication_search
      );
    } else {
      medications = await reportsModel.getAllMedications();
    }
    res.render("reports/by-date-range-report", {
      title: "Generate Report By Date Range",
      nav,
      messages: req.flash(),
      currentDate: Util.getCurrentDate(),
      errors: null,
    });
  } catch (error) {
    console.log("Error in by medication view:", error);
    next(error);
  }
};

/***********************************************
 * Generate "By Date" report results
 ***********************************************/
reportsController.generateByDateResult = async function (req, res, next) {
  try {
    const { startDate, endDate, reportType } = req.body;

    // Check the reportType and handle the request accordingly
    if (reportType === "by-date-result") {
      // Fetch report results from the model
      const reportResults = await reportsModel.getByDateRangeReport(
        startDate,
        endDate
      );

      // Calculate report totals
      const reportTotals = reportsModel.calculateReportTotals(reportResults);
      // Calculate total scripts for all medications combined
      const totalScriptsForAllMedications = reportResults.reduce(
        (total, result) => total + Number(result.total_scripts),
        0
      );

      // Render the results in the view
      res.render("reports/by-date-range-report", {
        title: "Generate Report By Date Range",
        reportResults,
        reportTotals,
        medications: [],
        strengths: [],
        classes: [],
        currentDate: Util.getCurrentDate(),
        errors: null,
        reportStartDate: startDate,
        reportEndDate: endDate,
        totalScriptsForAllMedications,
      });
    } else {
      // Handle other report types or show an error
      res.status(400).send("Invalid reportType");
    }
  } catch (error) {
    console.log("Error in generateByDateResult:", error);
    next(error);
  }
};

/***********************************************
 * Render the "By Class" reports form
 ***********************************************/
reportsController.deliverByClassView = async function (req, res, next) {
  try {
    const nav = await Util.getNav();
    let medications;

    if (req.query.medication_search) {
      medications = await reportsModel.getMatchingMedications(
        req.query.medication_search
      );
    } else {
      medications = await reportsModel.getAllMedications();
    }
    res.render("reports/by-class-report", {
      title: "Generate Report By Class",
      nav,
      messages: req.flash(),
      medications,
      currentDate: Util.getCurrentDate(),
      errors: null,
    });
  } catch (error) {
    console.log("Error in by class view:", error);
    next(error);
  }
};

/***********************************************
 * Generate "By Class" report results
 ***********************************************/
reportsController.generateByClassResult = async function (req, res, next) {
  try {
    const { control_class, startDate, endDate, reportType } = req.body;

    // Check the reportType and handle the request accordingly
    if (reportType === "by-class-result") {
      // Fetch report results from the model
      const reportResults = await reportsModel.getByClassReport(
        control_class,
        startDate,
        endDate
      );

      // Calculate report totals
      const reportTotals = reportsModel.calculateReportTotals(reportResults);

      // Calculate total scripts for all medications combined
      const totalScriptsForAllMedications = reportResults.reduce(
        (total, result) => total + Number(result.total_scripts),
        0
      );

      // Render the results in the view
      res.render("reports/by-class-report", {
        title: "Generate Report By Class",
        reportResults,
        reportTotals,
        medications: [],
        control_class,
        currentDate: Util.getCurrentDate(),
        errors: null,
        reportStartDate: startDate,
        reportEndDate: endDate,
        totalScriptsForAllMedications,
      });
    } else {
      // Handle other report types or show an error
      res.status(400).send("Invalid reportType");
    }
  } catch (error) {
    console.log("Error in generate By Class Result:", error);
    next(error);
  }
};

module.exports = reportsController;
