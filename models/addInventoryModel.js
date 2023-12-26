const db = require('../database/index'); // Replace with the actual database library

const models = {};

/*************************************************
 *   Add Inventory to Database
 ************************************************/

models.addInventory = async function (
  medication_name,
  medication_strength,
  control_class,
  current_inventory,
  threshold,
  last_used,
  unit
) {
  try {
    const sql = `
      INSERT INTO current_inventory 
      (medication_name, medication_strength, control_class, current_inventory, threshold, last_used, unit) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`;

    const result = await db.query(sql, [
      medication_name,
      medication_strength,
      control_class,
      current_inventory,
      threshold,
      last_used,
      unit,
    ]);

    return result;
  } catch (error) {
    console.error(error);
    return error.message;
  }
};

module.exports = models;
