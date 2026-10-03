/* ============================================================
   SCRIPT.JS — PORTFOLIO CORE INTERACTIONS & CASE STUDIES
   Header, Offcanvas Menu, Case Study Drawer, Filter, Toasts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 0. SCROLL UNLOCK SAFEGUARD ---------- */
    setTimeout(() => {
        const offcanvas = document.getElementById('offcanvasOverlay');
        const caseStudy = document.getElementById('caseStudyOverlay');
        const modal = document.getElementById('formSuccessModal');
        const isAnyModalOpen = (offcanvas && offcanvas.classList.contains('active')) ||
                               (caseStudy && caseStudy.classList.contains('active')) ||
                               (modal && modal.classList.contains('show'));
        if (!isAnyModalOpen) {
            document.body.classList.remove('no-scroll');
        }
    }, 500);

    /* ---------- 1. HEADER SCROLL STATE ---------- */
    const siteHeader = document.getElementById('siteHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            siteHeader?.classList.add('scrolled');
        } else {
            siteHeader?.classList.remove('scrolled');
        }
    }, { passive: true });

    /* ---------- 2. TOAST NOTIFICATION UTILITY ---------- */
    function showToast(message, icon = 'ph-check-circle') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="ph-bold ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /* ---------- 3. QUICK COPY EMAIL ---------- */
    const quickCopyEmail = document.getElementById('quickCopyEmail');
    if (quickCopyEmail) {
        quickCopyEmail.addEventListener('click', () => {
            const email = 'beingmohammedwaqar21@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email copied to clipboard!', 'ph-copy');
            }).catch(() => {
                showToast('Email: ' + email, 'ph-envelope');
            });
        });
    }

    /* ---------- 4. OFFCANVAS MENU DRAWER ---------- */
    const openOffcanvasBtn = document.getElementById('openOffcanvasBtn');
    const closeOffcanvasBtn = document.getElementById('closeOffcanvasBtn');
    const offcanvasOverlay = document.getElementById('offcanvasOverlay');
    const offcanvasLinks = document.querySelectorAll('.offcanvas-link');

    function openOffcanvas() {
        offcanvasOverlay?.classList.add('active');
        document.body.classList.add('no-scroll');
        if (typeof lenis !== 'undefined' && lenis) lenis.stop();
    }

    function closeOffcanvas() {
        offcanvasOverlay?.classList.remove('active');
        document.body.classList.remove('no-scroll');
        if (typeof lenis !== 'undefined' && lenis) lenis.start();
    }

    openOffcanvasBtn?.addEventListener('click', openOffcanvas);
    closeOffcanvasBtn?.addEventListener('click', closeOffcanvas);

    offcanvasOverlay?.addEventListener('click', (e) => {
        if (e.target === offcanvasOverlay) closeOffcanvas();
    });

    offcanvasLinks.forEach(link => {
        link.addEventListener('click', closeOffcanvas);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeOffcanvas();
            closeCaseStudy();
        }
    });

    /* ---------- 5. PORTFOLIO FILTERING ---------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ---------- 6. CASE STUDY MODAL / DRAWER SYSTEM ---------- */
    const caseStudyData = {
        oakandkey: {
            kicker: '01 / 09 · Production SaaS · New Zealand',
            title: 'Oak & Key Property Management Platform',
            summary: 'Designed, built, and shipped end-to-end as the sole developer for a New Zealand property firm (React, TypeScript, Supabase, PostgreSQL). Handles end-to-end lease tracking, automated rent collection, bond lodgements, maintenance workflows, interactive Recharts financial dashboards, and Excel/PDF data-ingestion pipelines.',
            liveUrl: 'https://oakandkey.co.nz/',
            githubUrl: '',
            whatIBuilt: 'Architected and developed the entire production SaaS platform from scratch as the sole engineer. Engineered data-ingestion pipelines parsing Excel (xlsx) and PDF (pdf-lib) forms enabling bulk imports of inspections, tenant applications, and payment ledgers, along with real-time financial reporting.',
            features: [
                'Room-by-room property breakdown with custom lease terms, bond lodgements, and rent schedules',
                'Data-ingestion pipelines parsing Excel (xlsx) and PDF (pdf-lib) forms for bulk inspection and ledger imports',
                'Interactive financial analytics dashboards powered by Recharts with dynamic revenue projections',
                'Supabase PostgreSQL backend with Row Level Security (RLS) ensuring strict multi-tenant isolation',
                'Automated digital inspection reports with high-resolution photo attachments and tenant signing'
            ],
            architecture: [
                { step: '01 · Client', title: 'React 18 + TypeScript + Tailwind' },
                { step: '02 · Pipelines', title: 'xlsx & pdf-lib Ingestion' },
                { step: '03 · Database', title: 'Supabase PostgreSQL (RLS)' },
                { step: '04 · Analytics', title: 'Recharts Financial Dashboards' },
                { step: '05 · Storage', title: 'Supabase Secure Media Bucket' }
            ],
            tech: ['React.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Recharts', 'xlsx', 'pdf-lib', 'Vite'],
            image: 'images/oakandkey.png'
        },
        yojanadost: {
            kicker: '02 / 09 · Production RAG · 1,000+ Daily Queries',
            title: 'Yojana Dost — RAG-Powered Knowledge Assistant',
            summary: 'A production Retrieval-Augmented Generation (RAG) assistant serving 1,000+ daily queries with cited answers over 150+ government scheme documents. On a 100-query labeled eval harness: pass rate rose from 38% to 74%, hallucinations fell from 38% to 8%, faithfulness rose from 2.1 to 4.6/5, with 86% citation precision and 82% recall@4.',
            liveUrl: 'https://yojana-dost.vercel.app/',
            githubUrl: 'https://github.com/waqarbytes/Yojana-dost',
            whatIBuilt: 'Engineered the complete production RAG pipeline using pgvector embeddings, hybrid dense + BM25 retrieval with reciprocal rank fusion, and cross-encoder reranking. Cut p95 latency from 294ms to 16ms (18x) and LLM cost by 53% via semantic caching (0.92 cosine threshold). Implemented multi-model routing with automatic fallback across OpenAI (GPT-4o), Anthropic (Claude), and xAI (Grok), live /api/metrics telemetry, and sliding-window rate limiting tested under 50-VU k6 load with 0% errors.',
            features: [
                'Hybrid retrieval: pgvector dense semantic embeddings + BM25 keyword search fused via Reciprocal Rank Fusion',
                'Cross-encoder reranking over 150+ scheme documents with 86% citation precision and 82% recall@4',
                'Semantic caching (0.92 cosine threshold) cutting p95 latency from 294ms to 16ms (18x) and per-query LLM cost by 53%',
                'Multi-model routing with automatic fallback across OpenAI GPT-4o, Anthropic Claude, and xAI Grok APIs',
                '100-query labeled eval harness achieving 74% pass rate, 8% hallucination rate, and 4.6/5 faithfulness',
                'Tested under 50-VU k6 load with 0% errors behind sliding-window rate limiting; 100% refusal on out-of-scope probes'
            ],
            architecture: [
                { step: '01 · Search', title: 'Hybrid BM25 + pgvector Dense' },
                { step: '02 · Rank', title: 'Reciprocal Rank Fusion + Reranker' },
                { step: '03 · Cache', title: 'Semantic Caching (0.92 Cosine)' },
                { step: '04 · Routing', title: 'GPT-4o + Claude + Grok Fallback' },
                { step: '05 · Telemetry', title: 'Live /api/metrics + k6 Load Tested' }
            ],
            tech: ['React', 'Node.js', 'PostgreSQL (pgvector)', 'OpenAI GPT-4o', 'Anthropic Claude', 'xAI Grok', 'BM25', 'Redis', 'k6', 'Vercel'],
            image: 'images/3.png'
        },
        indiaschemesmcp: {
            kicker: '03 / 09 · Open-Source AI Tooling · Claude Desktop',
            title: 'MCP Server — India Schemes Toolkit (Model Context Protocol)',
            summary: 'Built and published an authenticated Model Context Protocol (MCP) server exposing 6 tools for scheme search, eligibility checking, deadlines, and comparisons with Zod schema validation and sliding-window rate limiting; usable directly from Claude Desktop and any MCP-compatible client.',
            liveUrl: '',
            githubUrl: 'https://github.com/waqarbytes/india-schemes-mcp',
            whatIBuilt: 'Architected and built the full TypeScript MCP server following Anthropic\'s Model Context Protocol specification. Created 6 deterministic tools with strict Zod parameter validation, error handling, and rate-limiting middleware.',
            features: [
                'Exposes 6 authenticated MCP tools for semantic scheme search, eligibility criteria evaluation, deadline tracking, and scheme comparisons',
                'Type-safe schema validation on every tool call powered by Zod',
                'Sliding-window rate limiting preventing upstream API exhaustion',
                'Native compatibility with Claude Desktop and any MCP-compliant agent runtime',
                'Comprehensive test suite with unit tests verifying tool execution outputs'
            ],
            architecture: [
                { step: '01 · Client', title: 'Claude Desktop / MCP Client' },
                { step: '02 · Protocol', title: 'JSON-RPC over stdio / SSE' },
                { step: '03 · Validator', title: 'Zod Input Schema Enforcement' },
                { step: '04 · Tools', title: '6x Schemes Tools Registry' },
                { step: '05 · Security', title: 'Sliding-Window Rate Limiter' }
            ],
            tech: ['TypeScript', 'Model Context Protocol (MCP)', 'Zod', 'Node.js', 'JSON-RPC', 'Rate Limiting', 'Claude Desktop'],
            image: 'images/reflect_thrive.png'
        },
        habitflow: {
            kicker: '04 / 09 · Mobile Application · React Native',
            title: 'Habit Flow Mobile & AI Habit Coach',
            summary: 'A cross-platform React Native habit tracking mobile application with streak algorithms, interactive progress charts, and an intelligent in-app AI Habit Coach providing personalized behavioral nudges.',
            liveUrl: '',
            githubUrl: 'https://github.com/waqarbytes/habit-flow',
            whatIBuilt: 'Created the full cross-platform mobile application from scratch with custom animations, offline caching, cloud sync, and AI coaching integration.',
            features: [
                'Gamified habit streaks and milestone achievement badges',
                'AI Habit Coach offering personalized motivation and routine optimizations',
                'Interactive completion analytics and weekly consistency heatmaps',
                'Instant cloud synchronization across devices via Supabase'
            ],
            architecture: [
                { step: '01 · Mobile', title: 'React Native + Expo' },
                { step: '02 · AI Agent', title: 'Gemini Behavioral Coach' },
                { step: '03 · Sync', title: 'Supabase Realtime API' },
                { step: '04 · Storage', title: 'AsyncStorage Offline Cache' }
            ],
            tech: ['React Native', 'TypeScript', 'Supabase', 'Gemini AI', 'Chart.js', 'Mobile UI'],
            image: 'images/habitflow.png'
        },
        roomrental: {
            kicker: '05 / 09 · Full-Stack Platform · New Zealand',
            title: 'Room Rental Marketplace (findaroom.co.nz)',
            summary: 'Comprehensive property rental marketplace enabling landlords to showcase rooms and tenants to browse, filter by amenities/budget, and submit pre-tenancy verification applications.',
            liveUrl: 'https://findaroom.co.nz/',
            githubUrl: '',
            whatIBuilt: 'Built backend database models, authentication workflows, property search filters, and pre-tenancy application intake pipelines in PHP and MySQL.',
            features: [
                'Dynamic multi-filter search engine (price, location, furnished status)',
                'Landlord property listing dashboard with image uploads',
                'Online pre-tenancy application submission with validation',
                'Responsive mobile-first layout with Bootstrap and JavaScript'
            ],
            architecture: [
                { step: '01 · Client', title: 'Responsive HTML5/JS' },
                { step: '02 · Server', title: 'PHP MVC Architecture' },
                { step: '03 · Database', title: 'MySQL Relational DB' },
                { step: '04 · Media', title: 'Cloud File Storage' }
            ],
            tech: ['PHP', 'MySQL', 'JavaScript ES6', 'Bootstrap', 'REST Architecture'],
            image: 'images/2.png'
        },
        urbanlets: {
            kicker: '06 / 09 · Property Management Web App',
            title: 'Urban Lets Property Management',
            summary: 'A modern, clean property management website built for Urban Lets (New Zealand), showcasing property management services, tenant resources, maintenance forms, and company services.',
            liveUrl: 'https://urbanlets.co.nz/',
            githubUrl: '',
            whatIBuilt: 'Engineered a modern React application with high visual polish, clean responsive navigation, service booking forms, and SEO optimizations.',
            features: [
                'Interactive service packages for property owners',
                'Maintenance request ticketing form with email triggers',
                'Mobile-first responsive design tailored for New Zealand clients',
                'Fast load speeds and smooth scrolling micro-interactions'
            ],
            architecture: [
                { step: '01 · UI', title: 'React.js Component System' },
                { step: '02 · Styling', title: 'Tailwind CSS Utility Engine' },
                { step: '03 · Forms', title: 'FormSubmit / Email API' }
            ],
            tech: ['React.js', 'Tailwind CSS', 'JavaScript', 'Responsive UI'],
            image: 'images/urbanlets.png'
        },
        insightfulhabits: {
            kicker: '07 / 09 · Real-Time Analytics Web App',
            title: 'Insightful Habits Analytics Platform',
            summary: 'A habit-tracking web app analyzing 100+ daily entries with visual consistency charts and live Supabase real-time subscriptions for streak synchronization.',
            liveUrl: '',
            githubUrl: 'https://github.com/waqarbytes',
            whatIBuilt: 'Developed the real-time analytics dashboard with Chart.js, aggregating completion trends, streak probabilities, and longitudinal habit retention metrics.',
            features: [
                'Interactive completion velocity charts and heatmaps',
                'Supabase Realtime websocket subscriptions for zero-latency updates',
                'Streak loss prevention reminders and motivation algorithms',
                'Tested with 15 beta users achieving 40% improvement in habit awareness'
            ],
            architecture: [
                { step: '01 · Client', title: 'React.js + Chart.js' },
                { step: '02 · Engine', title: 'Analytics Aggregation Logic' },
                { step: '03 · Realtime', title: 'Supabase WebSocket DB' }
            ],
            tech: ['React.js', 'Chart.js', 'Node.js', 'Supabase', 'WebSockets'],
            image: 'images/insightful_habits.png'
        },
        reflectthrive: {
            kicker: '08 / 09 · AI Mindfulness Platform',
            title: 'Reflect & Thrive AI Journal',
            summary: 'An AI-powered reflective journaling platform featuring session summaries, structured timestamped entries, and 90-day mood-trend longitudinal behavioral analysis.',
            liveUrl: '',
            githubUrl: 'https://github.com/waqarbytes',
            whatIBuilt: 'Created the mood tracking data engine and NLP reflection summarizer, giving users actionable insights into emotional patterns over time.',
            features: [
                'NLP summarization of daily journal entries with sentiment scoring',
                '90-day mood visualization graphs identifying stress triggers',
                'Encrypted journal persistence with privacy-first authentication',
                'Daily streak counters and reflective writing prompts'
            ],
            architecture: [
                { step: '01 · UI', title: 'React 18 Dashboard' },
                { step: '02 · NLP', title: 'AI Sentiment Pipeline' },
                { step: '03 · Data', title: 'Encrypted Supabase DB' }
            ],
            tech: ['React.js', 'Node.js', 'Supabase', 'NLP Summaries', 'Chart.js'],
            image: 'images/reflect_thrive.png'
        },
        freshbite: {
            kicker: '09 / 09 · Hospitality Web App',
            title: 'Fresh Bite Catering Web App',
            summary: 'A clean, interactive catering web application featuring dynamic online food menus, booking reservation systems, and mobile-optimized galleries.',
            liveUrl: 'https://waqarbytes.github.io/Fresh-Bite/',
            githubUrl: 'https://github.com/waqarbytes/Fresh-Bite',
            whatIBuilt: 'Designed and coded the frontend interface with rich animations, modal menus, reservation forms, and mobile responsive menus.',
            features: [
                'Categorized interactive catering menus with pricing breakdowns',
                'Online event catering quote calculator and reservation form',
                'Lightweight vanilla JavaScript architecture with zero heavy dependencies',
                'Optimized asset delivery ensuring under 1s load times'
            ],
            architecture: [
                { step: '01 · UI', title: 'Semantic HTML5 + CSS3' },
                { step: '02 · Logic', title: 'Vanilla JS ES6+' },
                { step: '03 · Hosting', title: 'GitHub Pages CDN' }
            ],
            tech: ['HTML5', 'CSS3', 'JavaScript ES6', 'Responsive Web Design'],
            image: 'images/1.png'
        }
    };

    const caseStudyOverlay = document.getElementById('caseStudyOverlay');
    const caseStudyContent = document.getElementById('caseStudyContent');
    const closeCaseStudyBtn = document.getElementById('closeCaseStudyBtn');

    function openCaseStudy(projectId) {
        const data = caseStudyData[projectId];
        if (!data || !caseStudyContent) return;

        let liveBtnHtml = data.liveUrl ? `<a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-magnetic btn-lime" style="padding: 10px 22px; font-size: 0.85rem;"><span>Live Demo</span> <i class="ph ph-arrow-up-right"></i></a>` : '';
        let githubBtnHtml = data.githubUrl ? `<a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-magnetic btn-outline-glow" style="padding: 10px 22px; font-size: 0.85rem;"><span>GitHub</span> <i class="ph ph-github-logo"></i></a>` : '';

        let featuresHtml = data.features.map(f => `<li><i class="ph ph-check-circle"></i> <span>${f}</span></li>`).join('');
        
        let archHtml = data.architecture.map(a => `
            <div class="arch-node">
                <small>${a.step}</small>
                <strong>${a.title}</strong>
            </div>
        `).join('');

        let techHtml = data.tech.map(t => `<span class="case-study-tech-pill">${t}</span>`).join('');

        caseStudyContent.innerHTML = `
            <div class="case-study-hero">
                <span class="case-study-kicker">${data.kicker}</span>
                <h2 class="case-study-title">${data.title}</h2>
                <p class="case-study-summary">${data.summary}</p>
                <div class="case-study-links">
                    ${liveBtnHtml}
                    ${githubBtnHtml}
                </div>
            </div>

            <div class="case-study-section">
                <h3><i class="ph ph-code"></i> What I Built</h3>
                <p>${data.whatIBuilt}</p>
            </div>

            <div class="case-study-section">
                <h3><i class="ph ph-list-checks"></i> Core Capabilities</h3>
                <ul class="case-study-features-list">
                    ${featuresHtml}
                </ul>
            </div>

            <div class="case-study-section">
                <h3><i class="ph ph-tree-structure"></i> System Architecture</h3>
                <div class="arch-flow-grid">
                    ${archHtml}
                </div>
            </div>

            <div class="case-study-section">
                <h3><i class="ph ph-stack"></i> Tech Stack</h3>
                <div class="case-study-tech-pills">
                    ${techHtml}
                </div>
            </div>

            ${data.image ? `
            <div class="case-study-section">
                <h3><i class="ph ph-image"></i> Project Preview</h3>
                <div class="case-study-gallery">
                    <img src="${data.image}" alt="${data.title}" loading="lazy">
                </div>
            </div>
            ` : ''}
        `;

        caseStudyOverlay?.classList.add('active');
        document.body.classList.add('no-scroll');
        if (typeof lenis !== 'undefined' && lenis) lenis.stop();
    }

    function closeCaseStudy() {
        caseStudyOverlay?.classList.remove('active');
        document.body.classList.remove('no-scroll');
        if (typeof lenis !== 'undefined' && lenis) lenis.start();
    }

    // Bind triggers
    document.querySelectorAll('[data-case-study]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const id = el.getAttribute('data-case-study');
            if (id) openCaseStudy(id);
        });
    });

    closeCaseStudyBtn?.addEventListener('click', closeCaseStudy);
    caseStudyOverlay?.addEventListener('click', (e) => {
        if (e.target === caseStudyOverlay) closeCaseStudy();
    });

    /* ---------- 7. SMOOTH SCROLL WITH OFFSET ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetEl.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ---------- 8. STAT COUNTER ANIMATION ---------- */
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    let counted = false;

    function runCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'), 10);
            let current = 0;
            const step = Math.ceil(target / 40);
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target + '+';
                    clearInterval(interval);
                } else {
                    stat.textContent = current + '+';
                }
            }, 35);
        });
    }

    const heroStats = document.querySelector('.hero-right-col');
    if (heroStats) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !counted) {
                counted = true;
                runCounters();
            }
        }, { threshold: 0.3 });
        observer.observe(heroStats);
    }

});