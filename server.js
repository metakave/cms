require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { initDatabase } = require('./database/schema');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));

// API Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/post-types', require('./routes/api/postTypes'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/categories', require('./routes/api/categories'));
app.use('/api/tags', require('./routes/api/tags'));
app.use('/api/pages', require('./routes/api/pages'));

// Admin panel route
app.get('/admin*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin/index.html'));
});

// Frontend routes (will be implemented later)
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CMS Frontend</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          text-align: center;
        }
        h1 { color: #333; }
        a {
          display: inline-block;
          margin: 20px;
          padding: 12px 24px;
          background: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 6px;
        }
        a:hover { background: #0056b3; }
      </style>
    </head>
    <body>
      <h1>🚀 CMS is Running!</h1>
      <p>Your lightweight CMS is up and running.</p>
      <a href="/admin">Go to Admin Panel</a>
    </body>
    </html>
  `);
});

// Initialize database and start server
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🚀 CMS Server running on http://localhost:${PORT}`);
        console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
        console.log(`\n📝 Default credentials:`);
        console.log(`   Username: admin`);
        console.log(`   Password: admin123\n`);
    });
}).catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
