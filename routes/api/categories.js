const express = require('express');
const { db } = require('../../database/db');
const { slugify, ensureUniqueSlug } = require('../../utils/slugify');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all categories
router.get('/', (req, res) => {
    try {
        const categories = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Get single category
router.get('/:id', (req, res) => {
    try {
        const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});

// Create category
router.post('/', (req, res) => {
    try {
        const { name, slug, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const finalSlug = slug || slugify(name);
        const uniqueSlug = ensureUniqueSlug(finalSlug, 'categories', db);

        const result = db.prepare(`
      INSERT INTO categories (name, slug, description)
      VALUES (?, ?, ?)
    `).run(name, uniqueSlug, description || '');

        const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// Update category
router.put('/:id', (req, res) => {
    try {
        const { name, slug, description } = req.body;
        const id = req.params.id;

        const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

        if (!existing) {
            return res.status(404).json({ error: 'Category not found' });
        }

        let finalSlug = existing.slug;
        if (slug && slug !== existing.slug) {
            finalSlug = ensureUniqueSlug(slug, 'categories', db, id);
        }

        db.prepare(`
      UPDATE categories 
      SET name = ?, slug = ?, description = ?
      WHERE id = ?
    `).run(
            name || existing.name,
            finalSlug,
            description !== undefined ? description : existing.description,
            id
        );

        const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
        res.json(updated);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// Delete category
router.delete('/:id', (req, res) => {
    try {
        const id = req.params.id;

        const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

        if (!existing) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Delete category and its relationships (CASCADE will handle post_categories)
        db.prepare('DELETE FROM categories WHERE id = ?').run(id);

        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

module.exports = router;
