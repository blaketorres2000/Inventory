const db = require('../database/index');

const inventoryUsageModel = {};

/***********************************************
 * Get all medications from current_inventory
 ***********************************************/
inventoryUsageModel.getAllMedications = async () => {
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
inventoryUsageModel.getMatchingMedications = async (searchTerm) => {
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
 * Record medication usage in past_inventory
 ***********************************************/
inventoryUsageModel.recordUsage = async (medication_id, total_units, total_scripts, usage_date) => {
    try {
        // Get current inventory for the medication
        const currentInventory = await db.oneOrNone(`
            SELECT current_inventory FROM current_inventory
            WHERE medication_id = $1
        `, [medication_id]);

        if (!currentInventory) {
            throw new Error("Medication not found in current inventory.");
        }

        // Calculate updated current inventory
        const updatedInventory = currentInventory.current_inventory - parseInt(total_units, 10);

        // Start a transaction to ensure atomicity
        await db.tx(async (t) => {
            // Record usage in past_inventory
            await t.none(`
                INSERT INTO past_inventory (medication_id, day, total_scripts, total_units, ending_inventory)
                VALUES ($1, $2, $3, $4, $5)
            `, [medication_id, usage_date, total_scripts, total_units, updatedInventory]);

            // Update current inventory and last_used
            await t.none(`
                UPDATE current_inventory
                SET current_inventory = $1, last_used = $2
                WHERE medication_id = $3
            `, [updatedInventory, usage_date, medication_id]);
        });

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = inventoryUsageModel;
