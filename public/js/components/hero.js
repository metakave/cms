import { fetchAPI, renderLoading, renderError, formatDate } from '../utils.js';

export async function renderHero() {
    const contentArea = document.getElementById('content-area');
    document.body.classList.add('marketing-theme');

    // Reset layout overrides
    const layoutGrid = document.querySelector('.layout-grid');
    if (layoutGrid) {
        layoutGrid.style.display = 'block';
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.style.display = 'none';
    }

    contentArea.innerHTML = renderLoading();

    try {
        const posts = await fetchAPI('/api/posts');

        let html = `
            <!-- 1. Hero Section -->
            <div class="hero-section" style="margin-top: 64px; position: relative;">
                <div class="hero-glow"></div>
                
                <h1 class="hero-title">
                    Odoo Migration <br>
                    <span class="highlight">Service</span>
                </h1>
                
                <p class="hero-subtitle">
                    Seamlessly upgrade your ERP with zero downtime and data integrity.
                    Trust the experts to handle your business transformation.
                </p>
                
                <div class="hero-cta">
                   <a href="#" class="btn-hero-primary">Get a Quote</a>
                   <a href="#" class="btn-hero-secondary">View Services</a>
                </div>
            </div>

            <!-- New: Productivity Slider (Full Screen Style) -->
            <div class="productivity-section">
                <div class="container-xl">
                    <div class="section-label">Accelerate your workflow</div>
                    <h2 class="section-title">The future of building happens together.</h2>
                    
                    <div class="productivity-window">
                        <div class="window-header">
                            <div class="dot red"></div>
                            <div class="dot yellow"></div>
                            <div class="dot green"></div>
                            <div style="margin-left: 12px; color: #8b949e; font-size: 12px;">odoo-expert-chat.py</div>
                        </div>
                        <div class="window-content" id="productivity-slides">
                            <!-- Code Slide -->
                            <div class="productivity-slide active" data-slide="code">
                                <div class="slide-info">
                                    <h3>Build like the best</h3>
                                    <p>Write, test, and fix code quickly with GitHub Copilot, from simple boilerplate to complex features.</p>
                                </div>
                                <div class="slide-visual">
                                    <div class="copilot-chat">
                                        <div class="chat-bubble ai">Hi! I can help you refactor this Odoo module. Would you like to optimize the SQL queries?</div>
                                        <div class="chat-bubble user">Yes, please focus on the partner ledger generation.</div>
                                        <div class="chat-bubble ai">Processing... I've found 3 areas for optimization using prefetch_fields.</div>
                                        <div class="chat-input-mock">
                                            <span>Ask a question or type '/' for commands</span>
                                            <svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.109zM6.648 10.33l1.55 2.436 4.331-10.828-5.881 8.392zm4.11-8.586L4.01 11.234 1.236 8.71 10.758 1.744z"/></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Plan Slide -->
                            <div class="productivity-slide" data-slide="plan">
                                <div class="slide-info">
                                    <h3>Plan your roadmap</h3>
                                    <p>Align your team from idea to launch with tools that track work, visualize roadmaps, and gather insights.</p>
                                </div>
                                <div class="slide-visual">
                                    <div class="kanban-mock">
                                        <div class="kanban-col">
                                            <strong>Planning</strong>
                                            <div class="kanban-card">Audit Legacy DB</div>
                                            <div class="kanban-card">Module Mapping</div>
                                        </div>
                                        <div class="kanban-col">
                                            <strong>Building</strong>
                                            <div class="kanban-card">API refactor</div>
                                        </div>
                                        <div class="kanban-col">
                                            <strong>Complete</strong>
                                            <div class="kanban-card">Server Setup</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Complete remaining slides -->
                            <!-- Collaborate Slide -->
                            <div class="productivity-slide" data-slide="collaborate">
                                <div class="slide-info">
                                    <h3>Collaborate with ease</h3>
                                    <p>Enable your team to collaborate with agents to plan, code, and test the next big thing.</p>
                                </div>
                                <div class="slide-visual">
                                     <div class="chat-bubble ai" style="border-left: 4px solid #3fb950; background: rgba(63, 185, 80, 0.1);">
                                        <strong>github-agent</strong>: I've finished the porting of the 'sale_management' module to v17.
                                     </div>
                                     <div class="chat-bubble user" style="margin-top: 10px;">Great! I'll review the PR now.</div>
                                </div>
                            </div>
                            <!-- Automate Slide -->
                            <div class="productivity-slide" data-slide="automate">
                                <div class="slide-info">
                                    <h3>Automate everything</h3>
                                    <p>Improve your software development process by automating builds, tests, and deployments.</p>
                                </div>
                                <div class="slide-visual">
                                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                        <div style="background: #238636; padding: 4px 10px; border-radius: 20px; font-size: 11px;">Build: Success</div>
                                        <div style="background: #238636; padding: 4px 10px; border-radius: 20px; font-size: 11px;">Test: Success</div>
                                        <div style="background: #d29922; padding: 4px 10px; border-radius: 20px; font-size: 11px;">Deploy: Pending</div>
                                    </div>
                                    <div style="border-left: 2px dashed #30363d; margin-left: 20px; padding: 10px; color: #8b949e; font-size: 12px; margin-top: 10px;">
                                        $ odoo-bin migrate --db=test_v17<br>
                                        $ pytest tests/test_migration.py<br>
                                        ...
                                    </div>
                                </div>
                            </div>
                            <!-- Secure Slide -->
                            <div class="productivity-slide" data-slide="secure">
                                <div class="slide-info">
                                    <h3>Secure by default</h3>
                                    <p>Leverage tooling to detect, review, and fix vulnerabilities before they reach production.</p>
                                </div>
                                <div class="slide-visual" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                                    <svg height="64" viewBox="0 0 24 24" width="64" style="color: #3fb950; margin-bottom: 16px;"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"></path></svg>
                                    <div style="font-size: 12px; color: #d29922;">0 Vulnerabilities Detected in Migration Script</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Feature Tabs (Pill style) -->
            <div class="container-xl feature-tabs-container">
                <div class="feature-tabs-pill">
                    <button class="feature-tab active" data-tab="code">Code</button>
                    <button class="feature-tab" data-tab="plan">Plan</button>
                    <button class="feature-tab" data-tab="collaborate">Collaborate</button>
                    <button class="feature-tab" data-tab="automate">Automate</button>
                    <button class="feature-tab" data-tab="secure">Secure</button>
                </div>
                <div class="feature-tab-desc" id="feature-tab-desc">
                    Develop, test, and deploy Odoo modules with integrated CI/CD and expert validation.
                </div>
            </div>

            <!-- New: Infinite Scrolling Logos -->
            <div class="logo-marquee-section">
                <div class="logo-marquee-container">
                    <div class="logo-marquee-group">
                        <!-- Monochromatic client names as placeholders for monochromatic logos -->
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">PHILIPS</span>
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">SOCIETE GENERALE</span>
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">Spotify</span>
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">vodafone</span>
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">American Airlines</span>
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">Ford</span>
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">SAMSUNG</span>
                    </div>
                    <div class="logo-marquee-group">
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">PHILIPS</span>
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">SOCIETE GENERALE</span>
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">Spotify</span>
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">vodafone</span>
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">American Airlines</span>
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">Ford</span>
                        <span style="font-weight: 800; font-size: 24px; color: #656d76; margin-right: 40px;">SAMSUNG</span>
                    </div>
                </div>
            </div>

            <!-- 2. Scale/Stats Section (Trusted By) -->
            <div class="section-padding scale-section">
                <div class="container-xl">
                    <div class="section-label">Reliability</div>
                    <h2 class="section-title">Scale with Confidence.</h2>
                    <p class="section-desc">Join thousands of businesses running on Odoo infrastructure optimized for performance.</p>
                    
                    <div class="scale-grid">
                        <div>
                            <div class="scale-number">10k+</div>
                            <div class="scale-label">Modules Migrated</div>
                        </div>
                        <div>
                            <div class="scale-number">50+</div>
                            <div class="scale-label">Countries Served</div>
                        </div>
                        <div>
                            <div class="scale-number">100%</div>
                            <div class="scale-label">Data Integrity</div>
                        </div>
                        <div>
                            <div class="scale-number">24/7</div>
                            <div class="scale-label">Expert Support</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. Productivity/Features Section -->
            <div class="container-xl section-padding productivity-section">
                <div class="section-label">Accelerate</div>
                <h2 class="section-title">Seamless Transition to Odoo 17.</h2>
                <p class="section-desc">Experience a smooth migration process with our automated tools and expert validation.</p>
                
                <div class="feature-tabs">
                    <button class="feature-tab active" data-tab="migration">Data Migration</button>
                    <button class="feature-tab" data-tab="customization">Customization</button>
                    <button class="feature-tab" data-tab="training">Training</button>
                </div>
                
                <div class="feature-content" id="feature-display">
                    <!-- Default: Migration Window -->
                     <div class="ui-window">
                        <div class="window-header">
                            <div class="window-dot dot-red"></div>
                            <div class="window-dot dot-yellow"></div>
                            <div class="window-dot dot-green"></div>
                            <div style="margin-left: 12px; color: #8b949e;">migration_script.py</div>
                        </div>
                        <div class="window-body">
                            <div class="code-line"><span class="code-comment"># Initializing migration sequence...</span></div>
                            <div class="code-line"><span class="code-keyword">import</span> odoo_migration_tool <span class="code-keyword">as</span> omt</div>
                            <div class="code-line"><br></div>
                            <div class="code-line"><span class="code-func">def</span> <span class="code-func">migrate_partners</span>():</div>
                            <div class="code-line">&nbsp;&nbsp;source = omt.connect(<span class="code-string">"odoo_v14_db"</span>)</div>
                            <div class="code-line">&nbsp;&nbsp;target = omt.connect(<span class="code-string">"odoo_v17_db"</span>)</div>
                            <div class="code-line"><br></div>
                            <div class="code-line">&nbsp;&nbsp;<span class="code-keyword">print</span>(<span class="code-string">"🚀 Starting Partner Migration..."</span>)</div>
                            <div class="code-line">&nbsp;&nbsp;count = omt.transfer(source, target, <span class="code-string">"res.partner"</span>)</div>
                            <div class="code-line">&nbsp;&nbsp;<span class="code-keyword">return</span> f<span class="code-string">"✅ Successfully migrated {count} partners"</span></div>
                            <div class="code-line"><br></div>
                            <div class="code-line"><span class="code-comment"># Output:</span></div>
                            <div class="code-line" style="color: #7ee787;">> 🚀 Starting Partner Migration...</div>
                            <div class="code-line" style="color: #7ee787;">> ✅ Successfully migrated 14,502 partners (100%)</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 4. Collaboration/Management Section -->
            <div class="container-xl section-padding">
                <div class="section-label">Collaboration</div>
                <h2 class="section-title">Transparent Project Management.</h2>
                <p class="section-desc">Track every step of your migration with our dedicated project portal. No surprises.</p>
                
                <div class="kanban-board">
                    <div class="kanban-column">
                        <div class="kanban-header">
                            <span>ANALYSIS</span>
                            <span style="background: rgba(110,118,129,0.4); padding: 0 6px; border-radius: 10px;">2</span>
                        </div>
                        <div class="kanban-card">
                            <div style="font-weight: 600; font-size: 14px; color: #c9d1d9;">Legacy DB Audit</div>
                            <div class="kanban-tag tag-enhancement">Analysis</div>
                        </div>
                        <div class="kanban-card">
                            <div style="font-weight: 600; font-size: 14px; color: #c9d1d9;">Module Mapping</div>
                            <div class="kanban-tag tag-enhancement">Planning</div>
                        </div>
                    </div>
                    <div class="kanban-column">
                        <div class="kanban-header">
                            <span>DEVELOPMENT</span>
                            <span style="background: rgba(110,118,129,0.4); padding: 0 6px; border-radius: 10px;">3</span>
                        </div>
                        <div class="kanban-card">
                            <div style="font-weight: 600; font-size: 14px; color: #c9d1d9;">Custom Reports</div>
                            <div class="kanban-tag tag-feature">Dev</div>
                        </div>
                        <div class="kanban-card">
                            <div style="font-weight: 600; font-size: 14px; color: #c9d1d9;">API Integration</div>
                            <div class="kanban-tag tag-feature">API</div>
                        </div>
                    </div>
                    <div class="kanban-column">
                        <div class="kanban-header">
                            <span>TESTING</span>
                            <span style="background: rgba(110,118,129,0.4); padding: 0 6px; border-radius: 10px;">1</span>
                        </div>
                        <div class="kanban-card">
                            <div style="font-weight: 600; font-size: 14px; color: #c9d1d9;">UAT Session</div>
                            <div class="kanban-tag tag-bug">QA</div>
                        </div>
                    </div>
                    <div class="kanban-column">
                        <div class="kanban-header">
                            <span>DONE</span>
                            <span style="background: rgba(110,118,129,0.4); padding: 0 6px; border-radius: 10px;">5</span>
                        </div>
                        <div class="kanban-card">
                            <div style="font-weight: 600; font-size: 14px; color: #c9d1d9;">Sales Module Migration</div>
                            <div class="kanban-tag tag-feature">Done</div>
                        </div>
                         <div class="kanban-card">
                            <div style="font-weight: 600; font-size: 14px; color: #c9d1d9;">Server Setup</div>
                            <div class="kanban-tag tag-feature">Infra</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 5. Security Section -->
            <div class="section-padding security-section">
                <div class="container-xl">
                    <div class="section-label">Security</div>
                    <h2 class="section-title">Enterprise-grade Security.</h2>
                    <p class="section-desc">Your data is your most valuable asset. We ensure it stays that way.</p>
                    
                    <div class="security-grid">
                        <div class="security-card">
                            <div class="security-stat">99.9%</div>
                            <h3>Uptime During Migration</h3>
                            <p style="color: #8b949e;">Our "Zero Downtime" methodology ensures your business keeps running while we upgrade your system in the background.</p>
                        </div>
                        <div class="security-card">
                            <div class="security-stat">SOC2</div>
                            <h3>Compliant Processes</h3>
                            <p style="color: #8b949e;">We follow strict security protocols aligned with GDPR and SOC2 standards to handle your sensitive business data.</p>
                        </div>
                    </div>
                </div>
            </div>

             <!-- 6. Global/Update Section (Bento) -->
            <div class="container-xl section-padding globe-section">
                 <div class="globe-visual"></div>
                 <h2 class="section-title" style="position: relative; z-index: 1;">Global Reach. Local Support.</h2>
                 <p class="section-desc" style="margin: 0 auto; position: relative; z-index: 1;">Supporting businesses in over 50 countries with dedicated 24/7 assistance.</p>
            </div>

            <!-- FAQ Section -->
            <div class="container-xl section-padding faq-section" id="faq">
                <div class="section-label">Questions?</div>
                <h2 class="section-title">Common Migration FAQ.</h2>
                <div class="faq-container">
                    <div class="faq-item">
                        <button class="faq-question">
                            What version of Odoo should I migrate to?
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            We generally recommend migrating to the latest Long Term Support (LTS) version, which is currently Odoo 17. It offers the best performance, security, and the most advanced feature set.
                        </div>
                    </div>
                    <div class="faq-item">
                        <button class="faq-question">
                            How long does a typical migration take?
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            Timeline varies based on database size and complexity. A standard migration takes 2-4 weeks, while complex Enterprise systems with many custom modules can take 2-3 months.
                        </div>
                    </div>
                    <div class="faq-item">
                        <button class="faq-question">
                            Will I lose my data during the upgrade?
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            No. We follow a strict "Data First" protocol. We perform multiple test migrations on staging servers to ensure 100% data integrity before touching your production environment.
                        </div>
                    </div>
                    <div class="faq-item">
                        <button class="faq-question">
                            Can custom modules be migrated?
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            Yes. We specialize in porting custom code to the new Odoo OWL framework and adjusting module logic to align with updated core API changes.
                        </div>
                    </div>
                    <div class="faq-item">
                        <button class="faq-question">
                            What is the difference between Odoo Enterprise and Community migration?
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            Enterprise migrations are managed by Odoo S.A. for the database, but custom modules still require manual porting. Community migrations require a full manual migration of both data and code.
                        </div>
                    </div>
                    <div class="faq-item">
                        <button class="faq-question">
                            How do you handle third-party app migrations?
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            We check if the app provider has released a version for your target Odoo version. If not, we can manually port the functionality or find an equivalent modern alternative.
                        </div>
                    </div>
                    <div class="faq-item">
                        <button class="faq-question">
                            Is there any downtime involved?
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            We use a shadow-migration technique to minimize downtime. In most cases, the final "Go Live" switch results in less than 2 hours of maintenance time.
                        </div>
                    </div>
                    <div class="faq-item">
                        <button class="faq-question">
                            Do you provide training after the migration?
                            <span class="faq-icon">+</span>
                        </button>
                        <div class="faq-answer">
                            Absolutely. We provide comprehensive training sessions for your team to get comfortable with the new Odoo 17 interface and any performance-improving changes we've implemented.
                        </div>
                    </div>
                </div>
            </div>

            <div class="container-xl section-padding">
                <div class="section-label">Latest Insights</div>
                <h2 class="section-title">From the Blog.</h2>
                 <div class="bento-grid">
        `;

        if (posts && posts.length > 0) {
            posts.slice(0, 3).forEach(post => {
                html += `
                    <div class="bento-card">
                         <div class="bento-icon">
                             <svg aria-hidden="true" height="24" viewBox="0 0 24 24" version="1.1" width="24" data-view-component="true" class="octicon">
                                <path fill="currentColor" d="M3 3a2 2 0 0 1 2-2h9.982a2 2 0 0 1 1.414.586l4.018 4.018A2 2 0 0 1 21 7.018V21a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm2-.5a.5.5 0 0 0-.5.5v18a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V8.5h-4a2 2 0 0 1-2-2v-4Zm10 0v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 0-.146-.336l-4.018-4.018A.5.5 0 0 0 15 2.5Z"></path>
                            </svg>
                         </div>
                        <div class="bento-title">${post.title}</div>
                        <div class="bento-desc">${post.excerpt || 'Read our latest update.'}</div>
                        <a href="/posts/${post.slug}" class="bento-link">Read more →</a>
                    </div>
                `;
            });
        }

        html += `
                </div>
                <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
                    <a href="/blogs" class="btn-hero-secondary" style="font-size: 16px;">View all posts →</a>
                </div>
            </div>

            <!-- 7. Mascot Falling CTA Section (GitHub Style) -->
            <div class="lp-cta-section" id="falling-cta">
                <div class="lp-cta-glow"></div>
                <div class="star-field"></div>
                
                <div class="lp-cta-content container-xl">
                    <h2 class="lp-cta-title">Millions of businesses <br> call Odoo home.</h2>
                    <div class="lp-cta-btns">
                        <a href="#" class="btn-hero-primary">Start Migration</a>
                        <a href="#" class="btn-hero-secondary">Contact Sales</a>
                    </div>
                </div>
            </div>
        `;

        contentArea.innerHTML = html;

        // Add minimal JS for tabs
        const featureTabs = document.querySelectorAll('.feature-tab');
        const featureDesc = document.getElementById('feature-tab-desc');

        const tabData = {
            'code': 'Develop, test, and deploy Odoo modules with integrated CI/CD and expert validation.',
            'plan': 'Strategic planning and gap analysis for a risk-free migration to Odoo 17.',
            'collaborate': 'Transparent communication and real-time project tracking through our client portal.',
            'automate': 'Automated data cleaning and transformation tools for seamless ERP upgrades.',
            'secure': 'Enterprise-grade security and SOC2 compliant data handling during your migration.',
            'migration': 'Experience a smooth data migration process with our automated tools.',
            'customization': 'Custom Odoo modules tailored to your specific business needs.',
            'training': 'Comprehensive training for your team to master the new Odoo environment.'
        };

        featureTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabKey = tab.getAttribute('data-tab');

                // Update active state
                featureTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update description if it exists
                if (featureDesc) featureDesc.innerText = tabData[tabKey];

                // Update Productivity Slides
                const slides = document.querySelectorAll('.productivity-slide');
                slides.forEach(s => s.classList.remove('active'));
                const activeSlide = document.querySelector(`.productivity-slide[data-slide="${tabKey}"]`);
                if (activeSlide) activeSlide.classList.add('active');

                // Update feature-display if it exists (for the lower tabs)
                const display = document.getElementById('feature-display');
                if (display) {
                    renderTabContent(tabKey, display);
                }
            });
        });

        // Intersection Observer for falling mascots
        const ctaSection = document.getElementById('falling-cta');
        if (ctaSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const mascots = ctaSection.querySelectorAll('.cta-mascot');
                        mascots.forEach(m => m.classList.add('active'));
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(ctaSection);
        }

        // FAQ Interactivity
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                const isActive = item.classList.contains('active');

                // Close all other items
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });

    } catch (error) {
        console.error(error);
        if (contentArea) contentArea.innerHTML = renderError('Failed to load content');
    }
}

function renderTabContent(tab, display) {
    let content = '';

    if (tab === 'migration' || tab === 'code') {
        content = `
             <div class="ui-window">
                <div class="window-header">
                    <div class="window-dot dot-red"></div>
                    <div class="window-dot dot-yellow"></div>
                    <div class="window-dot dot-green"></div>
                    <div style="margin-left: 12px; color: #8b949e;">migration_script.py</div>
                </div>
                <div class="window-body">
                    <div class="code-line"><span class="code-comment"># Initializing migration sequence...</span></div>
                    <div class="code-line"><span class="code-keyword">import</span> odoo_migration_tool <span class="code-keyword">as</span> omt</div>
                    <div class="code-line"><br></div>
                    <div class="code-line"><span class="code-func">def</span> <span class="code-func">migrate_partners</span>():</div>
                    <div class="code-line">&nbsp;&nbsp;source = omt.connect(<span class="code-string">"odoo_v14_db"</span>)</div>
                    <div class="code-line">&nbsp;&nbsp;target = omt.connect(<span class="code-string">"odoo_v17_db"</span>)</div>
                    <div class="code-line"><br></div>
                    <div class="code-line">&nbsp;&nbsp;<span class="code-keyword">print</span>(<span class="code-string">"🚀 Starting Partner Migration..."</span>)</div>
                    <div class="code-line">&nbsp;&nbsp;count = omt.transfer(source, target, <span class="code-string">"res.partner"</span>)</div>
                    <div class="code-line">&nbsp;&nbsp;<span class="code-keyword">return</span> f<span class="code-string">"✅ Successfully migrated {count} partners"</span></div>
                    <div class="code-line"><br></div>
                     <div class="code-line"><span class="code-comment"># Output:</span></div>
                    <div class="code-line" style="color: #7ee787;">> 🚀 Starting Partner Migration...</div>
                    <div class="code-line" style="color: #7ee787;">> ✅ Successfully migrated 14,502 partners (100%)</div>
                </div>
            </div>`;
    } else if (tab === 'plan' || tab === 'customization') {
        content = `
            <div class="ui-window" style="padding: 40px; text-align: center;">
                <img src="/img/odoo_butterfly_mascot.png" style="width: 120px; margin-bottom: 24px;" alt="Butterfly Mascot">
                <h3 style="color: white; margin-bottom: 16px;">Strategic Migration Roadmap</h3>
                <p style="color: #8b949e;">Mapped 150+ custom modules to Odoo 17 core features.</p>
                <div style="display: flex; justify-content: center; gap: 8px; margin-top: 24px;">
                    <span class="kanban-tag tag-enhancement">Phase 1: Audit</span>
                    <span class="kanban-tag tag-feature">Phase 2: Mapping</span>
                    <span class="kanban-tag tag-bug">Phase 3: Testing</span>
                </div>
            </div>`;
    } else if (tab === 'collaborate' || tab === 'training') {
        content = `
            <div class="ui-window" style="padding: 0;">
                <div class="window-header">
                    <div style="margin-left: 12px; color: #8b949e;">Project Portal / Sprint-42</div>
                </div>
                <div style="padding: 20px;">
                     <div style="display: flex; gap: 12px; margin-bottom: 16px; align-items: center;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: #714B67; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">S</div>
                        <div style="flex-grow: 1;">
                            <div style="color: white; font-weight: 600;">Sadiq Alam</div>
                            <div style="color: #8b949e; font-size: 12px;">Pushed 4 commits to feature/accounting-v17</div>
                        </div>
                     </div>
                     <div style="background: #21262d; border: 1px solid #30363d; border-radius: 6px; padding: 12px; color: #c9d1d9;">
                        "Updated the partner ledger reconciliation logic for multi-currency support."
                     </div>
                </div>
            </div>`;
    } else if (tab === 'automate') {
        content = `
            <div class="ui-window">
                <div class="window-header">
                     <div style="margin-left: 12px; color: #8b949e;">Automated Migration Engine</div>
                </div>
                <div class="window-body" style="font-family: monospace; color: #7ee787;">
                    [09:24:51] [INFO] Loading dataset 'res.partner'...<br>
                    [09:24:52] [INFO] Applying auto-mapping rules (156 rules active)...<br>
                    [09:24:55] [INFO] Conflict detected: duplicate email in row 1242.<br>
                    [09:24:55] [ACTION] Auto-merging duplicate partners based on phone number.<br>
                    [09:25:01] [SUCCESS] Dataset 'res.partner' ready for import.
                </div>
            </div>`;
    } else if (tab === 'secure') {
        content = `
            <div class="ui-window" style="padding: 40px; text-align: center;">
                <svg height="64" viewBox="0 0 24 24" width="64" style="color: #3fb950; margin-bottom: 24px;"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"></path></svg>
                <h3 style="color: white; margin-bottom: 8px;">SOC2 Type II Compliant</h3>
                <p style="color: #8b949e;">End-to-end encryption for all data transfers during the migration process.</p>
            </div>`;
    }

    display.innerHTML = content;
}
