const db = require("../database/index");

const updateInventoryModel = {};

/***********************************************
 * Get all medications from current_inventory
 ***********************************************/
updateInventoryModel.getAllMedications = async () => {
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
updateInventoryModel.getMatchingMedications = async (searchTerm) => {
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
 * Update medication information in current_inventory
 ***********************************************/
updateInventoryModel.updateMedication = async (medication) => {
  try {
    const {
      medication_id,
      medication_name,
      medication_strength,
      control_class,
      current_inventory,
      unit,
      threshold,
      last_used,
    } = medication;

    const sql = `
      UPDATE current_inventory
      SET
        medication_name = $2,
        medication_strength = $3,
        control_class = $4,
        current_inventory = $5,
        unit = $6,
        threshold = $7,
        last_used = $8
      WHERE medication_id = $1
    `;

    // Use the 'timestamp with time zone' data type and convert to UTC
    const currentTimeStamp = new Date(last_used).toISOString();

    await db.query(sql, [
      medication_id,
      medication_name,
      medication_strength,
      control_class,
      current_inventory,
      unit,
      threshold,
      currentTimeStamp, // Use the converted timestamp
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = updateInventoryModel;
