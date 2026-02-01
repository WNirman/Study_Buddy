const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'study_buddy'
    });

    try {
        console.log('Adding priority column to tasks table...');
        await connection.query("ALTER TABLE tasks ADD COLUMN priority ENUM('low', 'medium', 'high') DEFAULT 'medium'");
        console.log('Migration successful!');
    } catch (err) {
        // Ignore error if column exists (code 1060: Duplicate column name)
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists.');
        } else {
            console.error('Migration failed:', err);
        }
    } finally {
        await connection.end();
    }
}

migrate();
