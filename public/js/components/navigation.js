import { fetchAPI } from '../utils.js';

export async function renderNavigation() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    try {
        // Try to fetch custom menus first
        const menus = await fetchAPI('/api/menus');

        let html = '';

        if (menus && menus.length > 0) {
            // Render custom menu
            // Filter top-level items (parent_id is null) - simple implementation for now
            // A full implementation would handle dropdowns
            const topLevel = menus.filter(m => !m.parent_id).sort((a, b) => a.order_index - b.order_index);

            topLevel.forEach(item => {
                let href = item.url;
                if (item.type === 'page' && item.page_id) {
                    // We need the slug. The menu API *should* probably return the slug via join, 
                    // but for now let's hope the frontend can resolve it or we fetch pages to map it.
                    // A better API design would join `pages` table.
                    // Quick fix: Fetch pages to map IDs if needed, or rely on URL if user entered it.
                    // Actually, my Menu Manager UI saves `page_id`. It doesn't save `slug`.
                    // I need to fetch pages to get the slug for the ID.
                }
            });

            // Re-think: Efficient way is to just fetch pages anyway to map slugs, 
            // OR update the API to join. 
            // Let's update the API to join pages table? No, let's just fetch pages here, it's small data.
            const pages = await fetchAPI('/api/pages');

            topLevel.forEach(item => {
                let href = item.url || '#';
                let label = item.label;

                if (item.type === 'page' && item.page_id) {
                    const page = pages.find(p => p.id == item.page_id);
                    if (page) {
                        href = `/${page.slug}`;
                    }
                }

                html += `<a href="${href}">${label}</a>`;
            });

        } else {
            // Fallback to auto-generated
            const pages = await fetchAPI('/api/pages');
            const postTypes = await fetchAPI('/api/post-types');

            html += `<a href="/">Overview</a>`;
            html += `<a href="/#faq">FAQ</a>`;

            if (postTypes && postTypes.length > 0) {
                postTypes.forEach(type => {
                    html += `<a href="/types/${type.slug}">${type.name}</a>`;
                });
            }

            if (pages && pages.length > 0) {
                pages.filter(p => p.status === 'published').forEach(page => {
                    html += `<a href="/${page.slug}">${page.title}</a>`;
                });
            }
        }

        // Add Admin link
        html += `<a href="/admin" target="_blank" style="margin-left: auto;">Admin</a>`;
        nav.innerHTML = html;

    } catch (error) {
        console.error('Nav Error:', error);
    }
}

export async function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const categories = await fetchAPI('/api/categories');
    const tags = await fetchAPI('/api/tags');

    let html = `
        <div class="sidebar-heading">Explore</div>
        <ul class="sidebar-menu">
            <li><a href="/">All Posts</a></li>
        </ul>
    `;

    if (categories && categories.length > 0) {
        html += `<div class="sidebar-heading" style="margin-top: 24px;">Categories</div>`;
        html += `<ul class="sidebar-menu">`;
        categories.forEach(cat => {
            html += `<li><a href="/categories/${cat.slug}">${cat.name}</a></li>`;
        });
        html += `</ul>`;
    }

    if (tags && tags.length > 0) {
        html += `<div class="sidebar-heading" style="margin-top: 24px;">Tags</div>`;
        html += `<div style="display: flex; flex-wrap: wrap; gap: 8px;">`;
        tags.forEach(tag => {
            html += `<a href="/tags/${tag.slug}" class="label">${tag.name}</a>`;
        });
        html += `</div>`;
    }

    sidebar.innerHTML = html;
}
