export async function fetchAPI(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('API request failed');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

export function renderLoading() {
    return `<div class="loading-state"><div class="spinner"></div></div>`;
}

export function renderError(message) {
    return `
        <div class="gh-box">
            <div class="gh-box-body" style="text-align: center; padding: 40px; color: var(--color-danger-fg);">
                <svg class="octicon" viewBox="0 0 16 16" width="32" height="32" fill="currentColor" style="margin-bottom: 16px;">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM4.5 11.5A3.502 3.502 0 0 0 8 11.5a3.502 3.502 0 0 0 3.5-3.5c0-.665-.175-1.288-.479-1.823l-4.844 5.823ZM11.5 4.5a3.502 3.502 0 0 0-3.5 3.5c0 .665.175 1.288.479 1.823l4.844-5.823ZM4 8a4 4 0 0 1 7.27-2.383l-5.653 6.796A3.996 3.996 0 0 1 4 8Z"></path>
                </svg>
                <h3>${message}</h3>
                <p>Please check the URL or try again later.</p>
                <a href="/" class="btn btn-primary" style="text-decoration: underline;">Go Home</a>
            </div>
        </div>
    `;
}

export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
