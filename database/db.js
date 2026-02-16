const { DatabaseSync } = require('node:sqlite');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './database/cms.db';
const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

// Helper function to run queries
const query = (sql, params = []) => {
    try {
        const stmt = db.prepare(sql);
        return stmt.all(...params);
    } catch (error) {
        console.error('Query error:', error);
        throw error;
    }
};

// Helper function to get a single row
const queryOne = (sql, params = []) => {
    try {
        const stmt = db.prepare(sql);
        return stmt.get(...params);
    } catch (error) {
        console.error('Query error:', error);
        throw error;
    }
};

// Helper function to run insert/update/delete
const run = (sql, params = []) => {
    try {
        const stmt = db.prepare(sql);
        return stmt.run(...params);
    } catch (error) {
        console.error('Run error:', error);
        throw error;
    }
};

// Transaction helper
const transaction = (callback) => {
    db.exec('BEGIN TRANSACTION');
    try {
        const result = callback();
        db.exec('COMMIT');
        return result;
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
};

module.exports = {
    db,
    query,
    queryOne,
    run,
    transaction
};
