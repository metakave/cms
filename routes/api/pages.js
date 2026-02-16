const express = require('express');
const { db } = require('../../database/db');
const { slugify, ensureUniqueSlug } = require('../../utils/slugify');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();

// All routes require authentication
// router.use(requireAuth); // Global auth removed for public access

// Get all pages
router.get('/', (req, res) => {
    try {
        const { status } = req.query;

        let query = 'SELECT * FROM pages';
        const params = [];

        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC';

        const pages = db.prepare(query).all(...params);
        res.json(pages);
    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

// Get single page
router.get('/:id', (req, res) => {
    try {
        const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id);

        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        res.json(page);
    } catch (error) {
        console.error('Error fetching page:', error);
        res.status(500).json({ error: 'Failed to fetch page' });
    }
});

// Create page
router.post('/', requireAuth, (req, res) => {
    try {
        const { title, slug, content, template, status, featured_image } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const finalSlug = slug || slugify(title);
        const uniqueSlug = ensureUniqueSlug(finalSlug, 'pages', db);

        const result = db.prepare(`
      INSERT INTO pages (title, slug, content, template, status, featured_image, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
            title,
            uniqueSlug,
            content || '',
            template || 'default',
            status || 'draft',
            featured_image || null,
            req.session.userId
        );

        const newPage = db.prepare('SELECT * FROM pages WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json(newPage);
    } catch (error) {
        console.error('Error creating page:', error);
        res.status(500).json({ error: 'Failed to create page' });
    }
});

// Update page
router.put('/:id', requireAuth, (req, res) => {
    try {
        const { title, slug, content, template, status, featured_image } = req.body;
        const id = req.params.id;

        const existing = db.prepare('SELECT * FROM pages WHERE id = ?').get(id);

        if (!existing) {
            return res.status(404).json({ error: 'Page not found' });
        }

        let finalSlug = existing.slug;
        if (slug && slug !== existing.slug) {
            finalSlug = ensureUniqueSlug(slug, 'pages', db, id);
        }

        db.prepare(`
      UPDATE pages 
      SET title = ?, slug = ?, content = ?, template = ?, status = ?, featured_image = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
            title || existing.title,
            finalSlug,
            content !== undefined ? content : existing.content,
            template || existing.template,
            status || existing.status,
            featured_image !== undefined ? featured_image : existing.featured_image,
            id
        );

        const updated = db.prepare('SELECT * FROM pages WHERE id = ?').get(id);
        res.json(updated);
    } catch (error) {
        console.error('Error updating page:', error);
        res.status(500).json({ error: 'Failed to update page' });
    }
});

// Delete page
router.delete('/:id', requireAuth, (req, res) => {
    try {
        const id = req.params.id;

        const existing = db.prepare('SELECT * FROM pages WHERE id = ?').get(id);

        if (!existing) {
            return res.status(404).json({ error: 'Page not found' });
        }

        db.prepare('DELETE FROM pages WHERE id = ?').run(id);

        res.json({ success: true, message: 'Page deleted' });
    } catch (error) {
        console.error('Error deleting page:', error);
        res.status(500).json({ error: 'Failed to delete page' });
    }
});

module.exports = router;
