const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get unlocked characters for a user
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    try {
        const [unlocks] = await pool.query(
            'SELECT character_id FROM unlocks WHERE user_id = ? ORDER BY unlocked_at ASC',
            [userId]
        );
        res.json(unlocks.map(u => u.character_id));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Unlock a character
router.post('/', async (req, res) => {
    const { userId, characterId } = req.body;
    if (!userId || !characterId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Check if already unlocked
        const [existing] = await pool.query(
            'SELECT id FROM unlocks WHERE user_id = ? AND character_id = ?',
            [userId, characterId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Character already unlocked' });
        }

        const [result] = await pool.query(
            'INSERT INTO unlocks (user_id, character_id) VALUES (?, ?)',
            [userId, characterId]
        );
        res.status(201).json({ id: result.insertId, userId, characterId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
