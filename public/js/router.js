export class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;

        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => this.handleLinkClick(e));

        // Initial route
        this.handleRoute();
    }

    handleLinkClick(e) {
        if (e.target.matches('a')) {
            const href = e.target.getAttribute('href');
            if (href && href.startsWith('/') && !href.startsWith('//')) {
                e.preventDefault();
                window.history.pushState(null, '', href);
                this.handleRoute();
            }
        } else if (e.target.closest('a')) {
            const link = e.target.closest('a');
            const href = link.getAttribute('href');
            if (href && href.startsWith('/') && !href.startsWith('//')) {
                e.preventDefault();
                window.history.pushState(null, '', href);
                this.handleRoute();
            }
        }
    }

    async handleRoute() {
        const path = window.location.pathname;
        let matched = false;

        for (const route of this.routes) {
            const regex = new RegExp('^' + route.path.replace(/:\w+/g, '([^/]+)') + '$');
            const match = path.match(regex);

            if (match) {
                matched = true;
                const params = match.slice(1);
                console.log(`Matched route: ${route.path} with params:`, params);
                await route.handler(...params);
                break;
            }
        }

        if (!matched) {
            console.warn('No route matched for:', path);
            this.routes.find(r => r.path === '/404')?.handler();
        }
    }
}
