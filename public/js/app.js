import { Router } from './router.js';
import { renderNavigation, renderSidebar } from './components/navigation.js';
import { renderHero } from './components/hero.js';
import { renderBlogArchive } from './components/blog-archive.js';
import { renderPost, renderPage } from './components/contentRenderer.js';

import { initParticles } from './utils/particles.js';

// Initialize Navigation and Sidebar
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    renderNavigation();
    renderSidebar();
});

// Configure Routes
const routes = [
    {
        path: '/',
        handler: renderHero
    },
    {
        path: '/blogs',
        handler: renderBlogArchive
    },
    {
        path: '/posts/:slug',
        handler: (slug) => renderPost(slug)
    },
    {
        path: '/:slug', // Catch-all for pages (e.g. /about)
        handler: (slug) => {
            // Need to distinguish between a page slug and other routes?
            // For now, assume anything top-level that isn't matched is a page.
            if (['admin', 'api'].includes(slug)) return; // Should be handled by server, but strict check
            renderPage(slug);
        }
    }
];

// Start Router
const router = new Router(routes);
