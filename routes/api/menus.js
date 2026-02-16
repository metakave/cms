const express = require('express');
const router = express.Router();
const { db } = require('../../database/db');
const { requireAuth } = require('../../middleware/auth');

// Get all menu items (flat list, frontend constructs hierarchy)
router.get('/', (req, res) => {
    try {
        const menus = db.prepare('SELECT * FROM menus ORDER BY order_index ASC').all();
        res.json(menus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create menu item
router.post('/', requireAuth, (req, res) => {
    const { label, url, type, parent_id, page_id, order_index } = req.body;

    if (!label) {
        return res.status(400).json({ error: 'Label is required' });
    }

    try {
        const result = db.prepare(`
      INSERT INTO menus (label, url, type, parent_id, page_id, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(label, url, type || 'page', parent_id, page_id, order_index || 0);

        res.json({
            id: result.lastInsertRowid,
            label,
            url,
            type,
            parent_id,
            page_id,
            order_index
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update menu item
router.put('/:id', requireAuth, (req, res) => {
    const { label, url, type, parent_id, page_id, order_index } = req.body;
    const { id } = req.params;

    try {
        db.prepare(`
      UPDATE menus
      SET label = ?, url = ?, type = ?, parent_id = ?, page_id = ?, order_index = ?
      WHERE id = ?
    `).run(label, url, type, parent_id, page_id, order_index, id);

        res.json({ message: 'Menu item updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete menu item
router.delete('/:id', requireAuth, (req, res) => {
    const { id } = req.params;

    try {
        db.prepare('DELETE FROM menus WHERE id = ?').run(id);
        res.json({ message: 'Menu item deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
