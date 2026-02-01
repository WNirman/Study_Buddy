const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all exams for a user
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    try {
        const [exams] = await pool.query(
            'SELECT * FROM exams WHERE user_id = ? ORDER BY date ASC',
            [userId]
        );
        res.json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create Exam
router.post('/', async (req, res) => {
    const { userId, subject_name, date, description } = req.body;
    if (!userId || !subject_name || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO exams (user_id, subject_name, date, description) VALUES (?, ?, ?, ?)',
            [userId, subject_name, date, description || '']
        );
        res.status(201).json({
            id: result.insertId,
            user_id: userId,
            subject_name,
            date,
            description
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Exam
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { subject_name, date, description } = req.body;

    try {
        let fields = [];
        let values = [];
        if (subject_name) { fields.push('subject_name = ?'); values.push(subject_name); }
        if (date) { fields.push('date = ?'); values.push(date); }
        if (description !== undefined) { fields.push('description = ?'); values.push(description); }

        if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

        values.push(id);
        await pool.query(`UPDATE exams SET ${fields.join(', ')} WHERE id = ?`, values);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete Exam
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM exams WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
