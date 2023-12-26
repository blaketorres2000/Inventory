// incomingInventoryModel.js
const db = require("../database/index");

const incomingInventoryModel = {};

/***********************************************
 * Get all medications from current_inventory
 ***********************************************/
incomingInventoryModel.getAllMedications = async () => {
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
incomingInventoryModel.getMatchingMedications = async (searchTerm) => {
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
 * Handle incoming inventory
 ***********************************************/
incomingInventoryModel.handleIncomingInventory = async (
  medication_id,
  added_inventory
) => {
  try {
    // Get current inventory for the medication
    const currentInventory = await db.oneOrNone(
      `
            SELECT current_inventory FROM current_inventory
            WHERE medication_id = $1
        `,
      [medication_id]
    );

    if (!currentInventory) {
      throw new Error("Medication not found in current inventory.");
    }

    // Calculate updated current inventory
    const updatedInventory =
      currentInventory.current_inventory + parseInt(added_inventory, 10);

    // Update current inventory
    await db.none(
      `
            UPDATE current_inventory
            SET current_inventory = $1
            WHERE medication_id = $2
        `,
      [updatedInventory, medication_id]
    );

    return true;
  } catch (error) {
    console.error("Incoming Inventory Model - Error:", error);
    throw error;
  }
};

module.exports = incomingInventoryModel;
