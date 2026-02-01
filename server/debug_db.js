const pool = require('./db');

async function check() {
    try {
        console.log("--- USERS ---");
        const [users] = await pool.query("SELECT * FROM users");
        console.table(users);

        console.log("\n--- TASKS ---");
        const [tasks] = await pool.query("SELECT * FROM tasks");
        console.table(tasks);

    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

check();
