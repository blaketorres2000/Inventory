const db = require("../database/index");

const reportsModel = {};

/***********************************************
 * Get all medications from current_inventory
 ***********************************************/
reportsModel.getAllMedications = async () => {
  try {
    const sql = `
              SELECT * FROM current_inventory
          `;

    const medications = await db.query(sql);
    return medications;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/***********************************************
 * Get medications that match the search term
 ***********************************************/
reportsModel.getMatchingMedications = async (searchTerm) => {
  try {
    const sql = `
              SELECT * FROM current_inventory
              WHERE medication_name ILIKE $1
          `;

    const medications = await db.query(sql, [`%${searchTerm}%`]);
    return medications;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/***********************************************
 * Get medication information from current_inventory based on medication_name
 ***********************************************/
reportsModel.getMedicationInfo = async (medicationName) => {
  try {
    const sql = `
            SELECT medication_id FROM current_inventory
            WHERE medication_name ILIKE $1
            LIMIT 1
        `;

    const medicationInfo = await db.oneOrNone(sql, [`%${medicationName}%`]);

    if (!medicationInfo) {
      throw new Error("Medication not found in current inventory.");
    }

    return medicationInfo;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/***********************************************
 * Get "By Medication" report results from past_inventory
 ***********************************************/
reportsModel.getByMedicationReport = async (
  medication_id,
  startDate,
  endDate
) => {
  try {
    const sql = `
              SELECT day AS date_used, total_scripts, total_units, ending_inventory
              FROM past_inventory
              WHERE medication_id = $1
              AND day BETWEEN $2 AND $3
          `;

    const reportResults = await db.query(sql, [
      medication_id,
      startDate,
      endDate,
    ]);

    return reportResults;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/***********************************************
 * Get "By Date Range" report results from past_inventory
 ***********************************************/
reportsModel.getByDateRangeReport = async (startDate, endDate) => {
  try {
    const sql = `
    SELECT
    c.medication_name,
    c.medication_strength,
    c.control_class,
    SUM(p.total_scripts) AS total_scripts,
    SUM(p.total_units) AS total_units
    FROM
    past_inventory p
    JOIN
    current_inventory c ON p.medication_id = c.medication_id
    WHERE
    p.day BETWEEN $1 AND $2
    GROUP BY
    c.medication_name, c.medication_strength, c.control_class
    `;
    const reportResults = await db.query(sql, [startDate, endDate]);
    return reportResults;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/***********************************************
 * Get "By Class" report results from past_inventory
 ***********************************************/
reportsModel.getByClassReport = async (control_class, startDate, endDate) => {
  try {
    const sql = `
    SELECT
    c.medication_name,
    c.medication_strength,
    c.control_class,
    SUM(p.total_scripts) AS total_scripts,
    SUM(p.total_units) AS total_units
    FROM
    past_inventory p
    JOIN
    current_inventory c ON p.medication_id = c.medication_id
    WHERE c.control_class = $1
    AND p.day BETWEEN $2 AND $3
    GROUP BY
    c.medication_name, c.medication_strength, c.control_class
    `;

    const reportResults = await db.query(sql, [
      control_class,
      startDate,
      endDate,
    ]);
    return reportResults;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/***********************************************
 * Calculate report totals
 ***********************************************/
reportsModel.calculateReportTotals = (reportResults) => {
  const times = reportResults.length;
  const totalScripts = reportResults.reduce(
    (acc, result) => acc + result.total_scripts,
    0
  );
  const totalUnits = reportResults.reduce(
    (acc, result) => acc + result.total_units,
    0
  );
  const averageUnitsPerScript = times === 0 ? 0 : totalUnits / totalScripts;

  return {
    times,
    totalScripts,
    totalUnits,
    averageUnitsPerScript,
  };
};

/***********************************************
 * Get medications that fall below the minimum threshold
 ***********************************************/
reportsModel.getThresholdReport = async () => {
  try {
    const sql = `
              SELECT * FROM current_inventory
              WHERE current_inventory.current_inventory < current_inventory.threshold
          `;

    const reportResults = await db.query(sql);
    return reportResults;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/***********************************************
 * Get quantities on hand by class
 ***********************************************/
reportsModel.getOnHand = async (control_class) => {
  try {
    const sql = `
      SELECT * FROM current_inventory
      WHERE current_inventory.control_class = control_class
    `;

    const reportResults = await db.query(sql, [control_class]);

    return reportResults;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/***********************************************
 * Get medications by ID for "Medication Comparison" report
 ***********************************************/
reportsModel.getMedicationsByIds = async (medicationIds) => {
  try {
    const sql = `
              SELECT * FROM current_inventory
              WHERE medication_id IN ($1:csv)
          `;

    const medications = await db.query(sql, [medicationIds]);
    return medications;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = reportsModel;
