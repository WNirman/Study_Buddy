const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all tasks for a user
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    try {
        // 1. Check for overdue tasks (using local date string to match client)
        const d = new Date();
        const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        const [overdueTasks] = await pool.query(
            'SELECT * FROM tasks WHERE user_id = ? AND completed = 0 AND due_date < ?',
            [userId, today]
        );

        if (overdueTasks.length > 0) {
            const idsToUpdate = overdueTasks.map(t => t.id);
            const placeholders = idsToUpdate.map(() => '?').join(',');
            await pool.query(
                `UPDATE tasks SET due_date = ?, reminded = 1 WHERE id IN (${placeholders})`,
                [today, ...idsToUpdate]
            );
        }

        // 2. Fetch all tasks
        const [tasks] = await pool.query(
            'SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC',
            [userId]
        );
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create Task
router.post('/', async (req, res) => {
    const { userId, title, due_date, priority, duration_minutes } = req.body;

    console.log('[SERVER] Received create task request:', req.body);

    if (!userId || !title || !due_date) {
        console.error('[SERVER] Missing fields:', { userId, title, due_date });
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO tasks (user_id, title, due_date, priority, duration_minutes) VALUES (?, ?, ?, ?, ?)',
            [userId, title, due_date, priority || 'medium', duration_minutes || 60]
        );
        res.status(201).json({
            id: result.insertId,
            user_id: userId,
            title,
            due_date,
            completed: 0,
            priority: priority || 'medium',
            duration_minutes: duration_minutes || 60
        });
    } catch (error) {
        console.error('[SERVER] Error creating task:', error.message);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Update Task
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { completed, title, due_date, priority, duration_minutes } = req.body;

    try {
        // Fetch current task state first if we need to handle points
        let pointsChange = 0;
        let userId = null;

        if (completed !== undefined) {
            const [rows] = await pool.query('SELECT user_id, duration_minutes, completed FROM tasks WHERE id = ?', [id]);
            if (rows.length > 0) {
                const task = rows[0];
                userId = task.user_id;
                const oldCompleted = Boolean(task.completed);
                const newCompleted = Boolean(completed);

                if (oldCompleted !== newCompleted) {
                    // Calculate points: 50 points per hour (approx 0.83 pts/min), min 10 pts
                    const duration = task.duration_minutes || 60;
                    const pts = Math.max(10, Math.round(duration * (50 / 60)));

                    if (newCompleted) {
                        // Work done -> Add points
                        pointsChange = pts;
                    } else {
                        // Undo -> Remove points
                        pointsChange = -pts;
                    }
                }
            }
        }

        let fields = [];
        let values = [];
        if (completed !== undefined) { fields.push('completed = ?'); values.push(completed); }
        if (title) { fields.push('title = ?'); values.push(title); }
        if (due_date) { fields.push('due_date = ?'); values.push(due_date); }
        if (priority) { fields.push('priority = ?'); values.push(priority); }
        if (duration_minutes) { fields.push('duration_minutes = ?'); values.push(duration_minutes); }

        if (fields.length === 0 && pointsChange === 0) return res.status(400).json({ error: 'No fields to update' });

        if (fields.length > 0) {
            values.push(id);
            await pool.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, values);
        }

        // Apply points change if needed
        if (pointsChange !== 0 && userId) {
            if (pointsChange > 0) {
                await pool.query('UPDATE users SET points = points + ? WHERE id = ?', [pointsChange, userId]);
            } else {
                // Ensure points don't go below 0? assuming unsigned or handled, but logic says GREATEST(0, ...)
                // Math.abs for subtraction
                await pool.query('UPDATE users SET points = GREATEST(0, points - ?) WHERE id = ?', [Math.abs(pointsChange), userId]);
            }
        }

        res.json({ success: true, pointsChange });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete Task
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
