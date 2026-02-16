const express = require('express');
const { db } = require('../../database/db');
const { slugify, ensureUniqueSlug } = require('../../utils/slugify');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();

// All routes require authentication
// router.use(requireAuth); // Global auth removed for public access

// Get all post types
router.get('/', (req, res) => {
    try {
        const postTypes = db.prepare('SELECT * FROM post_types ORDER BY created_at DESC').all();
        res.json(postTypes);
    } catch (error) {
        console.error('Error fetching post types:', error);
        res.status(500).json({ error: 'Failed to fetch post types' });
    }
});

// Get single post type
router.get('/:id', (req, res) => {
    try {
        const postType = db.prepare('SELECT * FROM post_types WHERE id = ?').get(req.params.id);

        if (!postType) {
            return res.status(404).json({ error: 'Post type not found' });
        }

        res.json(postType);
    } catch (error) {
        console.error('Error fetching post type:', error);
        res.status(500).json({ error: 'Failed to fetch post type' });
    }
});

// Create post type
router.post('/', requireAuth, (req, res) => {
    try {
        const { name, slug, icon, description, settings } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const finalSlug = slug || slugify(name);
        const uniqueSlug = ensureUniqueSlug(finalSlug, 'post_types', db);

        const result = db.prepare(`
      INSERT INTO post_types (name, slug, icon, description, settings)
      VALUES (?, ?, ?, ?, ?)
    `).run(
            name,
            uniqueSlug,
            icon || '📄',
            description || '',
            settings || '{}'
        );

        const newPostType = db.prepare('SELECT * FROM post_types WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json(newPostType);
    } catch (error) {
        console.error('Error creating post type:', error);
        res.status(500).json({ error: 'Failed to create post type' });
    }
});

// Update post type
router.put('/:id', requireAuth, (req, res) => {
    try {
        const { name, slug, icon, description, settings } = req.body;
        const id = req.params.id;

        const existing = db.prepare('SELECT * FROM post_types WHERE id = ?').get(id);

        if (!existing) {
            return res.status(404).json({ error: 'Post type not found' });
        }

        let finalSlug = existing.slug;
        if (slug && slug !== existing.slug) {
            finalSlug = ensureUniqueSlug(slug, 'post_types', db, id);
        }

        db.prepare(`
      UPDATE post_types 
      SET name = ?, slug = ?, icon = ?, description = ?, settings = ?
      WHERE id = ?
    `).run(
            name || existing.name,
            finalSlug,
            icon !== undefined ? icon : existing.icon,
            description !== undefined ? description : existing.description,
            settings !== undefined ? settings : existing.settings,
            id
        );

        const updated = db.prepare('SELECT * FROM post_types WHERE id = ?').get(id);
        res.json(updated);
    } catch (error) {
        console.error('Error updating post type:', error);
        res.status(500).json({ error: 'Failed to update post type' });
    }
});

// Delete post type
router.delete('/:id', requireAuth, (req, res) => {
    try {
        const id = req.params.id;

        const existing = db.prepare('SELECT * FROM post_types WHERE id = ?').get(id);

        if (!existing) {
            return res.status(404).json({ error: 'Post type not found' });
        }

        // Check if there are posts using this post type
        const postCount = db.prepare('SELECT COUNT(*) as count FROM posts WHERE post_type_id = ?').get(id);

        if (postCount.count > 0) {
            return res.status(400).json({
                error: `Cannot delete post type with ${postCount.count} existing posts`
            });
        }

        db.prepare('DELETE FROM post_types WHERE id = ?').run(id);

        res.json({ success: true, message: 'Post type deleted' });
    } catch (error) {
        console.error('Error deleting post type:', error);
        res.status(500).json({ error: 'Failed to delete post type' });
    }
});

module.exports = router;
