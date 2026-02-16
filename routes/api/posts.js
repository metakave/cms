const express = require('express');
const { db } = require('../../database/db');
const { slugify, ensureUniqueSlug } = require('../../utils/slugify');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all posts with filters
router.get('/', (req, res) => {
    try {
        const { post_type, category, tag, status } = req.query;

        let query = `
      SELECT p.*, pt.name as post_type_name, pt.slug as post_type_slug
      FROM posts p
      LEFT JOIN post_types pt ON p.post_type_id = pt.id
    `;

        const conditions = [];
        const params = [];

        if (post_type) {
            conditions.push('pt.slug = ?');
            params.push(post_type);
        }

        if (status) {
            conditions.push('p.status = ?');
            params.push(status);
        }

        if (category) {
            query = `
        SELECT DISTINCT p.*, pt.name as post_type_name, pt.slug as post_type_slug
        FROM posts p
        LEFT JOIN post_types pt ON p.post_type_id = pt.id
        LEFT JOIN post_categories pc ON p.id = pc.post_id
        LEFT JOIN categories c ON pc.category_id = c.id
      `;
            conditions.push('c.slug = ?');
            params.push(category);
        }

        if (tag) {
            query = `
        SELECT DISTINCT p.*, pt.name as post_type_name, pt.slug as post_type_slug
        FROM posts p
        LEFT JOIN post_types pt ON p.post_type_id = pt.id
        LEFT JOIN post_tags pt_tags ON p.id = pt_tags.post_id
        LEFT JOIN tags t ON pt_tags.tag_id = t.id
      `;
            conditions.push('t.slug = ?');
            params.push(tag);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY p.created_at DESC';

        const posts = db.prepare(query).all(...params);

        // Fetch categories and tags for each post
        posts.forEach(post => {
            post.categories = db.prepare(`
        SELECT c.* FROM categories c
        JOIN post_categories pc ON c.id = pc.category_id
        WHERE pc.post_id = ?
      `).all(post.id);

            post.tags = db.prepare(`
        SELECT t.* FROM tags t
        JOIN post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?
      `).all(post.id);
        });

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Get single post
router.get('/:id', (req, res) => {
    try {
        const post = db.prepare(`
      SELECT p.*, pt.name as post_type_name, pt.slug as post_type_slug
      FROM posts p
      LEFT JOIN post_types pt ON p.post_type_id = pt.id
      WHERE p.id = ?
    `).get(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Fetch categories and tags
        post.categories = db.prepare(`
      SELECT c.* FROM categories c
      JOIN post_categories pc ON c.id = pc.category_id
      WHERE pc.post_id = ?
    `).all(post.id);

        post.tags = db.prepare(`
      SELECT t.* FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `).all(post.id);

        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// Create post
router.post('/', (req, res) => {
    try {
        const { title, slug, content, excerpt, post_type_id, status, featured_image, category_ids, tag_ids } = req.body;

        if (!title || !post_type_id) {
            return res.status(400).json({ error: 'Title and post type are required' });
        }

        const finalSlug = slug || slugify(title);
        const uniqueSlug = ensureUniqueSlug(finalSlug, 'posts', db);

        const result = db.prepare(`
      INSERT INTO posts (title, slug, content, excerpt, post_type_id, status, featured_image, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
            title,
            uniqueSlug,
            content || '',
            excerpt || '',
            post_type_id,
            status || 'draft',
            featured_image || null,
            req.session.userId
        );

        const postId = result.lastInsertRowid;

        // Add categories
        if (category_ids && Array.isArray(category_ids)) {
            const insertCategory = db.prepare('INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)');
            category_ids.forEach(catId => {
                insertCategory.run(postId, catId);
            });
        }

        // Add tags
        if (tag_ids && Array.isArray(tag_ids)) {
            const insertTag = db.prepare('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)');
            tag_ids.forEach(tagId => {
                insertTag.run(postId, tagId);
            });
        }

        const newPost = db.prepare(`
      SELECT p.*, pt.name as post_type_name, pt.slug as post_type_slug
      FROM posts p
      LEFT JOIN post_types pt ON p.post_type_id = pt.id
      WHERE p.id = ?
    `).get(postId);

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Update post
router.put('/:id', (req, res) => {
    try {
        const { title, slug, content, excerpt, post_type_id, status, featured_image, category_ids, tag_ids } = req.body;
        const id = req.params.id;

        const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

        if (!existing) {
            return res.status(404).json({ error: 'Post not found' });
        }

        let finalSlug = existing.slug;
        if (slug && slug !== existing.slug) {
            finalSlug = ensureUniqueSlug(slug, 'posts', db, id);
        }

        db.prepare(`
      UPDATE posts 
      SET title = ?, slug = ?, content = ?, excerpt = ?, post_type_id = ?, 
          status = ?, featured_image = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
            title || existing.title,
            finalSlug,
            content !== undefined ? content : existing.content,
            excerpt !== undefined ? excerpt : existing.excerpt,
            post_type_id || existing.post_type_id,
            status || existing.status,
            featured_image !== undefined ? featured_image : existing.featured_image,
            id
        );

        // Update categories
        if (category_ids !== undefined) {
            db.prepare('DELETE FROM post_categories WHERE post_id = ?').run(id);
            if (Array.isArray(category_ids)) {
                const insertCategory = db.prepare('INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)');
                category_ids.forEach(catId => {
                    insertCategory.run(id, catId);
                });
            }
        }

        // Update tags
        if (tag_ids !== undefined) {
            db.prepare('DELETE FROM post_tags WHERE post_id = ?').run(id);
            if (Array.isArray(tag_ids)) {
                const insertTag = db.prepare('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)');
                tag_ids.forEach(tagId => {
                    insertTag.run(id, tagId);
                });
            }
        }

        const updated = db.prepare(`
      SELECT p.*, pt.name as post_type_name, pt.slug as post_type_slug
      FROM posts p
      LEFT JOIN post_types pt ON p.post_type_id = pt.id
      WHERE p.id = ?
    `).get(id);

        res.json(updated);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
});

// Delete post
router.delete('/:id', (req, res) => {
    try {
        const id = req.params.id;

        const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

        if (!existing) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Delete post and its relationships (CASCADE will handle post_categories and post_tags)
        db.prepare('DELETE FROM posts WHERE id = ?').run(id);

        res.json({ success: true, message: 'Post deleted' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

module.exports = router;
