const db = require('../database/index');

const inventoryUsageModel = {};

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

        console.log('Medication ID:', medication_id);
        console.log('Total Units:', total_units);
        console.log('Total Scripts:', total_scripts);
        console.log('Usage Date:', usage_date);
        console.log('Current Inventory:', currentInventory.current_inventory);
        console.log('Updated Inventory:', updatedInventory);

        // Start a transaction to ensure atomicity
        await db.tx(async (t) => {
            // Record usage in past_inventory
            await t.none(`
                INSERT INTO past_inventory (medication_id, day, total_scripts, total_units, ending_inventory)
                VALUES ($1, $2, $3, $4, $5)
            `, [medication_id, usage_date, total_scripts, total_units, updatedInventory]);

            console.log('Recorded in past_inventory');

            // Update current inventory
            await t.none(`
                UPDATE current_inventory
                SET current_inventory = $1
                WHERE medication_id = $2
            `, [updatedInventory, medication_id]);

            console.log('Updated current_inventory:', updatedInventory);
        });

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = inventoryUsageModel;
