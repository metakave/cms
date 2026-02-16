import { fetchAPI, renderLoading, renderError, formatDate } from '../utils.js';

function resetLayout() {
    document.body.classList.add('marketing-theme');
    document.body.classList.remove('customer-story-theme');
    const layoutGrid = document.querySelector('.layout-grid');
    if (layoutGrid) layoutGrid.style.display = 'grid';
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'block';
}

export async function renderPost(slug) {
    resetLayout();

    // Switch to single column layout for story
    document.body.classList.add('marketing-theme');
    document.body.classList.add('customer-story-theme');
    const layoutGrid = document.querySelector('.layout-grid');
    if (layoutGrid) layoutGrid.style.display = 'block'; // Disable grid
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'none'; // Hide sidebar

    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = renderLoading();

    try {
        const posts = await fetchAPI('/api/posts');
        const post = posts.find(p => p.slug === slug);

        if (!post) {
            contentArea.innerHTML = renderError('Post not found');
            return;
        }

        const date = formatDate(post.created_at);

        let heroStyle = '';
        let overlayClass = '';
        if (post.featured_image) {
            heroStyle = `background-image: url('${post.featured_image}'); background-size: cover; background-position: center;`;
            overlayClass = 'has-bg-image';
        }

        const html = `
            <div class="story-hero-wrapper ${overlayClass}" style="${heroStyle}">
                <div class="hero-overlay"></div>
                <div class="container-xl" style="position: relative; z-index: 2;">
                    <div class="story-meta">
                        <span class="story-category">${post.category_name || 'Success Story'}</span>
                    </div>
                    <h1 class="story-title">${post.title}</h1>
                    <div class="story-lead">${post.excerpt || ''}</div>
                </div>
            </div>

            <div class="story-body-wrapper">
                <div class="container-md story-content">
                    <div class="story-meta-bar">
                        <div class="meta-item">
                            <span class="meta-label">Published</span>
                            <span class="meta-value">${date}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Author</span>
                            <span class="meta-value">Odoo Expert</span>
                        </div>
                         <div class="meta-item">
                            <span class="meta-label">Share</span>
                            <span class="meta-value">
                                <a href="#">Twitter</a> &nbsp; <a href="#">LinkedIn</a>
                            </span>
                        </div>
                    </div>
                    
                    <div class="markdown-body">
                        ${post.content || '<em>No content provided.</em>'}
                    </div>

                    <div class="story-footer-nav">
                        <a href="/" class="btn-link">← Back to Overview</a>
                    </div>
                </div>
            </div>
        `;

        contentArea.innerHTML = html;

    } catch (error) {
        contentArea.innerHTML = renderError('Failed to load post');
    }
}

export async function renderPage(slug) {
    resetLayout();

    // Switch to single column layout for pages too
    document.body.classList.add('marketing-theme');
    document.body.classList.add('customer-story-theme');
    const layoutGrid = document.querySelector('.layout-grid');
    if (layoutGrid) layoutGrid.style.display = 'block';
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'none';

    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = renderLoading();

    try {
        const pages = await fetchAPI('/api/pages');
        const page = pages.find(p => p.slug === slug);

        if (!page) {
            contentArea.innerHTML = renderError('Page not found');
            return;
        }

        let heroStyle = '';
        let overlayClass = '';
        if (page.featured_image) {
            heroStyle = `background-image: url('${page.featured_image}'); background-size: cover; background-position: center;`;
            overlayClass = 'has-bg-image';
        }

        const html = `
            <div class="story-hero-wrapper ${overlayClass}" style="${heroStyle}">
                <div class="hero-overlay"></div>
                <div class="container-xl" style="position: relative; z-index: 2;">
                    <h1 class="story-title">${page.title}</h1>
                </div>
            </div>

            <div class="story-body-wrapper">
                <div class="container-md story-content">
                    <div class="markdown-body">
                        ${page.content || '<em>No content provided.</em>'}
                    </div>
                </div>
            </div>
        `;

        contentArea.innerHTML = html;

    } catch (error) {
        console.error(error);
        contentArea.innerHTML = renderError('Failed to load page');
    }
}
