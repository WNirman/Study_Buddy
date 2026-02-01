const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all subjects with marks for a user
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    try {
        const [subjects] = await pool.query('SELECT * FROM subjects WHERE user_id = ?', [userId]);

        // Fetch marks for each subject
        // Optimization: Could use a JOIN, but for MVP loop is okay or one big query
        const subjectsWithMarks = await Promise.all(subjects.map(async (sub) => {
            const [marks] = await pool.query('SELECT * FROM marks WHERE subject_id = ?', [sub.id]);
            return { ...sub, marks };
        }));

        res.json(subjectsWithMarks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add Subject
router.post('/', async (req, res) => {
    const { userId, name, credit_hours } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO subjects (user_id, name, credit_hours) VALUES (?, ?, ?)',
            [userId, name, credit_hours || 0]
        );
        res.status(201).json({ id: result.insertId, name, credit_hours });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add Mark
router.post('/:subjectId/marks', async (req, res) => {
    const { subjectId } = req.params;
    const { name, type, score, max_score, weightage } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO marks (subject_id, name, type, score, max_score, weightage) VALUES (?, ?, ?, ?, ?, ?)',
            [subjectId, name, type, score, max_score, weightage]
        );
        res.status(201).json({ id: result.insertId, subjectId, type, score });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
