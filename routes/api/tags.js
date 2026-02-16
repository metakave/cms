const express = require('express');
const { db } = require('../../database/db');
const { slugify, ensureUniqueSlug } = require('../../utils/slugify');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();

// All routes require authentication
// router.use(requireAuth); // Global auth removed for public access

// Get all tags
router.get('/', (req, res) => {
    try {
        const tags = db.prepare('SELECT * FROM tags ORDER BY name ASC').all();
        res.json(tags);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});

// Get single tag
router.get('/:id', (req, res) => {
    try {
        const tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(req.params.id);

        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        res.json(tag);
    } catch (error) {
        console.error('Error fetching tag:', error);
        res.status(500).json({ error: 'Failed to fetch tag' });
    }
});

// Create tag
router.post('/', requireAuth, (req, res) => {
    try {
        const { name, slug } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const finalSlug = slug || slugify(name);
        const uniqueSlug = ensureUniqueSlug(finalSlug, 'tags', db);

        const result = db.prepare(`
      INSERT INTO tags (name, slug)
      VALUES (?, ?)
    `).run(name, uniqueSlug);

        const newTag = db.prepare('SELECT * FROM tags WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json(newTag);
    } catch (error) {
        console.error('Error creating tag:', error);
        res.status(500).json({ error: 'Failed to create tag' });
    }
});

// Update tag
router.put('/:id', requireAuth, (req, res) => {
    try {
        const { name, slug } = req.body;
        const id = req.params.id;

        const existing = db.prepare('SELECT * FROM tags WHERE id = ?').get(id);

        if (!existing) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        let finalSlug = existing.slug;
        if (slug && slug !== existing.slug) {
            finalSlug = ensureUniqueSlug(slug, 'tags', db, id);
        }

        db.prepare(`
      UPDATE tags 
      SET name = ?, slug = ?
      WHERE id = ?
    `).run(
            name || existing.name,
            finalSlug,
            id
        );

        const updated = db.prepare('SELECT * FROM tags WHERE id = ?').get(id);
        res.json(updated);
    } catch (error) {
        console.error('Error updating tag:', error);
        res.status(500).json({ error: 'Failed to update tag' });
    }
});

// Delete tag
router.delete('/:id', requireAuth, (req, res) => {
    try {
        const id = req.params.id;

        const existing = db.prepare('SELECT * FROM tags WHERE id = ?').get(id);

        if (!existing) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        // Delete tag and its relationships (CASCADE will handle post_tags)
        db.prepare('DELETE FROM tags WHERE id = ?').run(id);

        res.json({ success: true, message: 'Tag deleted' });
    } catch (error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({ error: 'Failed to delete tag' });
    }
});

module.exports = router;
