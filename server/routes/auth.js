const express = require('express');
const router = express.Router();
const pool = require('../db');

// Register
router.post('/register', async (req, res) => {
    const { username, password, student_type, target_gpa } = req.body;

    if (!username || !password || !student_type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Check if user exists
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Insert user
        const [result] = await pool.query(
            'INSERT INTO users (username, password, student_type, target_gpa) VALUES (?, ?, ?, ?)',
            [username, password, student_type, target_gpa || null]
        );

        res.status(201).json({ id: result.insertId, username, student_type, target_gpa });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Return user info (excluding password)
        const { password: _, ...userInfo } = user;
        res.json(userInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
