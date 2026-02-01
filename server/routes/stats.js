const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get User Stats (Points, Streak, Hotplate)
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    try {
        // Basic User Info
        const [users] = await pool.query('SELECT points, student_type, target_gpa FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        const user = users[0];

        // Calculate Streak (consecutive days with completed tasks)
        const [streak] = await pool.query(
            `SELECT COUNT(DISTINCT DATE(due_date)) as streak 
             FROM tasks 
             WHERE user_id = ? AND completed = 1 
             AND DATE(due_date) >= DATE_SUB(CURDATE(), INTERVAL 100 DAY)`,
            [userId]
        );
        const currentStreak = streak[0]?.streak || 0;

        // Get Unlocked Characters (from unlocks table)
        const [unlockedChars] = await pool.query(
            'SELECT character_id FROM unlocks WHERE user_id = ? ORDER BY unlocked_at ASC',
            [userId]
        );
        const unlockedCharacters = unlockedChars.map(u => u.character_id);

        // Hotplate Data: Count usage per day (tasks completed + focus sessions)
        // 1. Task completions by date
        const [taskActivity] = await pool.query(
            `SELECT DATE(due_date) as date, COUNT(*) as count 
       FROM tasks 
       WHERE user_id = ? AND completed = 1 
       GROUP BY DATE(due_date)`,
            [userId]
        );

        // 2. Focus sessions by date
        const [focusActivity] = await pool.query(
            `SELECT DATE(start_time) as date, COUNT(*) as count 
       FROM focus_sessions 
       WHERE user_id = ? 
       GROUP BY DATE(start_time)`,
            [userId]
        );

        // Merge activities
        const activityMap = {};
        taskActivity.forEach(r => {
            const d = r.date.toISOString().split('T')[0];
            activityMap[d] = (activityMap[d] || 0) + r.count;
        });
        focusActivity.forEach(r => {
            const d = r.date.toISOString().split('T')[0];
            activityMap[d] = (activityMap[d] || 0) + r.count;
        });

        const hotplate = Object.entries(activityMap).map(([date, count]) => ({ date, count }));

        res.json({
            points: user.points,
            target_gpa: user.target_gpa,
            student_type: user.student_type,
            streak: currentStreak,
            unlockedCharacters,
            hotplate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Log Focus Session
router.post('/focus', async (req, res) => {
    const { userId, duration, points } = req.body;

    try {
        const startTime = new Date();
        await pool.query(
            'INSERT INTO focus_sessions (user_id, start_time, duration_minutes, points_earned) VALUES (?, ?, ?, ?)',
            [userId, startTime, duration, points]
        );

        // Update user points
        await pool.query('UPDATE users SET points = points + ? WHERE id = ?', [points, userId]);

        res.json({ success: true, pointsEarned: points });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
