const pool = require('./db');

async function run() {
    try {
        // Check if column exists
        const [rows] = await pool.query("SHOW COLUMNS FROM tasks LIKE 'duration_minutes'");
        if (rows.length === 0) {
            await pool.query("ALTER TABLE tasks ADD COLUMN duration_minutes INT DEFAULT 60");
            console.log("SUCCESS: Added duration_minutes column to tasks table.");
        } else {
            console.log("INFO: duration_minutes column already exists.");
        }
    } catch (e) {
        console.error("ERROR: Failed to add column: " + e.message);
    } finally {
        process.exit();
    }
}

run();
