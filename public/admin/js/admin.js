// Global state
const state = {
    user: null,
    currentPage: 'dashboard',
    postTypes: [],
    categories: [],
    tags: []
};

// API Helper
const api = {
    async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get(url) {
        return this.request(url);
    },

    post(url, body) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    put(url, body) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    delete(url) {
        return this.request(url, {
            method: 'DELETE'
        });
    }
};

// Authentication
async function checkAuth() {
    try {
        const data = await api.get('/api/auth/check');
        if (data.authenticated) {
            state.user = data.user;
            showDashboard();
        } else {
            showLogin();
        }
    } catch (error) {
        showLogin();
    }
}

async function login(username, password) {
    try {
        const data = await api.post('/api/auth/login', { username, password });
        state.user = data.user;
        showDashboard();
    } catch (error) {
        throw error;
    }
}

async function logout() {
    try {
        await api.post('/api/auth/logout');
        state.user = null;
        showLogin();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function showLogin() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    loadPage('dashboard');
}

// Navigation
function loadPage(pageName) {
    state.currentPage = pageName;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });

    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'post-types': 'Post Types',
        'posts': 'Posts',
        'pages': 'Pages',
        'categories': 'Categories',
        'tags': 'Tags',
        'menus': 'Menus'
    };

    document.getElementById('pageTitle').textContent = titles[pageName] || pageName;

    // Load page content
    const pageContent = document.getElementById('pageContent');
    const topbarActions = document.getElementById('topbarActions');

    switch (pageName) {
        case 'dashboard':
            renderDashboard(pageContent);
            topbarActions.innerHTML = '';
            break;
        case 'post-types':
            renderPostTypes(pageContent, topbarActions);
            break;
        case 'posts':
            renderPosts(pageContent, topbarActions);
            break;
        case 'pages':
            renderPages(pageContent, topbarActions);
            break;
        case 'categories':
            renderCategories(pageContent, topbarActions);
            break;
        case 'tags':
            renderTags(pageContent, topbarActions);
            break;
        case 'menus':
            renderMenus(pageContent, topbarActions);
            break;
    }
}

// Dashboard
function renderDashboard(container) {
    container.innerHTML = `
    <div class="card">
      <h2>Welcome to Odoo Migration Service! 🎉</h2>
      <p class="text-muted">Manage your content from the sidebar navigation.</p>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
      <div class="card">
        <h3>📋 Post Types</h3>
        <p class="text-muted">Create custom post types for your content</p>
        <button class="btn btn-primary btn-sm" onclick="loadPage('post-types')">Manage</button>
      </div>
      
      <div class="card">
        <h3>📝 Posts</h3>
        <p class="text-muted">Create and edit your posts</p>
        <button class="btn btn-primary btn-sm" onclick="loadPage('posts')">Manage</button>
      </div>
      
      <div class="card">
        <h3>📄 Pages</h3>
        <p class="text-muted">Manage static pages</p>
        <button class="btn btn-primary btn-sm" onclick="loadPage('pages')">Manage</button>
      </div>

       <div class="card">
        <h3>🔗 Menus</h3>
        <p class="text-muted">Manage navigation menus</p>
        <button class="btn btn-primary btn-sm" onclick="loadPage('menus')">Manage</button>
      </div>
      
      <div class="card">
        <h3>🏷️ Categories</h3>
        <p class="text-muted">Organize content with categories</p>
        <button class="btn btn-primary btn-sm" onclick="loadPage('categories')">Manage</button>
      </div>
    </div>
  `;
}

// Utility functions
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    const pageContent = document.getElementById('pageContent');
    pageContent.insertBefore(alertDiv, pageContent.firstChild);

    setTimeout(() => alertDiv.remove(), 3000);
}

function confirmDelete(message) {
    return confirm(message);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');

        try {
            await login(username, password);
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Navigation links
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage(link.dataset.page);
        });
    });

    // Check authentication on load
    checkAuth();
});
