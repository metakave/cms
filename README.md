# 🚀 Lightweight CMS

A custom-built, lightweight Content Management System with a modern admin panel and frontend. Built with Node.js, Express, and SQLite for maximum portability and ease of deployment.

## ✨ Features

- **Custom Post Types**: Create unlimited custom post types with unique slugs and icons
- **Posts Management**: Full CRUD operations with rich content editing
- **Pages**: Static pages with template support
- **Categories & Tags**: Organize content with flexible taxonomy
- **Editable Slugs**: Full control over URL-friendly slugs with automatic uniqueness validation
- **Modern Admin Panel**: Beautiful dark mode interface with glassmorphism design
- **SQLite Database**: Zero-configuration, file-based database
- **Session-based Authentication**: Secure admin access
- **RESTful API**: Clean API architecture for all operations

## 📋 Requirements

- Node.js >= 18.0.0
- npm or yarn

## 🔧 Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` to customize:
   - `PORT`: Server port (default: 3000)
   - `SESSION_SECRET`: Change this to a random secret in production
   - `ADMIN_USERNAME`: Default admin username
   - `ADMIN_PASSWORD`: Default admin password

4. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the CMS:**
   - Frontend: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`
   - Default credentials: `admin` / `admin123`

## 📁 Project Structure

```
cms/
├── database/
│   ├── db.js              # Database connection
│   └── schema.js          # Database schema & initialization
├── middleware/
│   └── auth.js            # Authentication middleware
├── routes/
│   └── api/
│       ├── auth.js        # Authentication endpoints
│       ├── postTypes.js   # Post types CRUD
│       ├── posts.js       # Posts CRUD
│       ├── pages.js       # Pages CRUD
│       ├── categories.js  # Categories CRUD
│       └── tags.js        # Tags CRUD
├── public/
│   └── admin/
│       ├── index.html     # Admin panel HTML
│       ├── css/
│       │   └── admin.css  # Admin panel styles
│       └── js/
│           ├── admin.js   # Main admin logic
│           └── components/
│               ├── postTypes.js
│               ├── posts.js
│               ├── pages.js
│               ├── categories.js
│               └── tags.js
├── utils/
│   └── slugify.js         # Slug generation utilities
├── server.js              # Main server file
├── package.json
└── .env                   # Environment configuration
```

## 🎯 Usage

### Creating Post Types

1. Navigate to **Post Types** in the admin panel
2. Click **New Post Type**
3. Enter name, slug (optional), icon, and description
4. Save

### Creating Posts

1. Navigate to **Posts** in the admin panel
2. Click **New Post**
3. Fill in:
   - Title (required)
   - Slug (auto-generated from title if left empty)
   - Post Type (required)
   - Content
   - Excerpt
   - Status (draft/published)
   - Categories (select multiple)
   - Tags (select multiple)
4. Save

### Managing Categories & Tags

- Navigate to **Categories** or **Tags**
- Create, edit, or delete as needed
- Slugs are auto-generated but can be customized

### Creating Pages

1. Navigate to **Pages**
2. Click **New Page**
3. Fill in title, slug, content, template, and status
4. Save

## 🔒 Security Recommendations

For production deployment:

1. **Change default credentials** immediately
2. **Use a strong SESSION_SECRET** (random string, at least 32 characters)
3. **Enable HTTPS** with SSL certificates
4. **Set secure cookie options** in production
5. **Implement rate limiting** for login attempts
6. **Regular backups** of the SQLite database file

## 🚀 Deployment

### VPS (Ubuntu/Debian)

1. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. Clone your CMS to the server

3. Install dependencies:
   ```bash
   npm install --production
   ```

4. Install PM2 for process management:
   ```bash
   sudo npm install -g pm2
   ```

5. Start the CMS:
   ```bash
   pm2 start server.js --name cms
   pm2 save
   pm2 startup
   ```

6. Set up Nginx as reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t lightweight-cms .
docker run -p 3000:3000 -v $(pwd)/database:/app/database lightweight-cms
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check auth status

### Post Types
- `GET /api/post-types` - List all
- `POST /api/post-types` - Create
- `PUT /api/post-types/:id` - Update
- `DELETE /api/post-types/:id` - Delete

### Posts
- `GET /api/posts` - List all (supports filters: post_type, category, tag, status)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create
- `PUT /api/posts/:id` - Update
- `DELETE /api/posts/:id` - Delete

### Categories
- `GET /api/categories` - List all
- `POST /api/categories` - Create
- `PUT /api/categories/:id` - Update
- `DELETE /api/categories/:id` - Delete

### Tags
- `GET /api/tags` - List all
- `POST /api/tags` - Create
- `PUT /api/tags/:id` - Update
- `DELETE /api/tags/:id` - Delete

### Pages
- `GET /api/pages` - List all
- `GET /api/pages/:id` - Get single page
- `POST /api/pages` - Create
- `PUT /api/pages/:id` - Update
- `DELETE /api/pages/:id` - Delete

## 🛠️ Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## 📝 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ using Node.js, Express, and SQLite
