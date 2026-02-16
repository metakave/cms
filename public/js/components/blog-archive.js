import { fetchAPI, renderLoading, renderError, formatDate } from '../utils.js';

export async function renderBlogArchive() {
    const contentArea = document.getElementById('content-area');
    document.body.classList.add('marketing-theme');

    contentArea.innerHTML = renderLoading();

    try {
        const posts = await fetchAPI('/api/posts');

        let html = `
            <div class="container-xl section-padding" style="margin-top: 64px;">
                <div class="section-label">Changelog</div>
                <h1 class="hero-title" style="text-align: left; margin-bottom: 40px;">Latest Updates & Insights</h1>
                
                <div class="blog-grid">
        `;

        if (posts && posts.length > 0) {
            posts.forEach(post => {
                const date = formatDate(post.created_at);
                html += `
                    <div class="blog-post-row" style="padding: 32px 0; border-bottom: 1px solid #30363d; display: flex; gap: 32px;">
                        <div style="flex: 0 0 150px; color: #8b949e; font-size: 14px;">${date}</div>
                        <div style="flex: 1;">
                            <h2 style="font-size: 24px; margin-bottom: 12px;"><a href="/posts/${post.slug}" style="color: #ffffff; text-decoration: none;">${post.title}</a></h2>
                            <p style="color: #8b949e; line-height: 1.6; margin-bottom: 16px;">${post.excerpt || 'Dive into our latest technical insights and project updates.'}</p>
                            <a href="/posts/${post.slug}" class="btn-hero-secondary" style="font-size: 13px; padding: 6px 16px;">Read more</a>
                        </div>
                    </div>
                `;
            });
        } else {
            html += `<p style="color: #8b949e;">No blog posts available yet.</p>`;
        }

        html += `
                </div>
            </div>
        `;

        contentArea.innerHTML = html;

    } catch (error) {
        console.error(error);
        contentArea.innerHTML = renderError('Failed to load blogs');
    }
}
