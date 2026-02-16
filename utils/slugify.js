/**
 * Generate URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
};

/**
 * Ensure slug is unique by appending number if needed
 * @param {string} slug - Base slug
 * @param {string} table - Table name to check uniqueness
 * @param {object} db - Database connection
 * @param {number} excludeId - ID to exclude from uniqueness check (for updates)
 * @returns {string} Unique slug
 */
const ensureUniqueSlug = (slug, table, db, excludeId = null) => {
    let uniqueSlug = slug;
    let counter = 1;

    while (true) {
        let query = `SELECT id FROM ${table} WHERE slug = ?`;
        const params = [uniqueSlug];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        const existing = db.prepare(query).get(...params);

        if (!existing) {
            return uniqueSlug;
        }

        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }
};

module.exports = {
    slugify,
    ensureUniqueSlug
};
