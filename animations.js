/* ============================================================
   ANIMATIONS.JS — HIGH PERFORMANCE GSAP, LENIS & CANVAS ENGINE
   Ultra-Smooth Momentum Scrolling, ScrollTrigger Reveals,
   Magnetic Interactions, 3D Card Tilt, Animated Counter
   ============================================================ */

/* Global Lenis instance reference */
let lenis = null;

/* ---------- 0. LENIS SMOOTH SCROLL ENGINE ---------- */
(function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    } else {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Ultra-Smooth Anchor Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    lenis.scrollTo(targetEl, {
                        offset: -20,
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }
            }
        });
    });
})();

/* ---------- 1. PRELOADER CONTROLLER ---------- */
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    const bar = document.getElementById('preloaderBar');
    const pct = document.getElementById('preloaderPct');

    function finishPreloader() {
        document.body.classList.remove('no-scroll');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }
        fireEntranceAnimations();
        initScrollReveals();
        initStatsCounters();
    }

    if (!preloader || !bar || !pct) {
        document.body.classList.remove('no-scroll');
        setTimeout(() => {
            fireEntranceAnimations();
            initScrollReveals();
            initStatsCounters();
        }, 100);
        return;
    }

    document.body.classList.add('no-scroll');

    let current = 0;
    const duration = 850; // Snappy 0.85s duration
    const startTime = performance.now();
    let isFinished = false;

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function updateLoader(now) {
        if (isFinished) return;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        current = Math.floor(easeOutCubic(progress) * 100);

        if (bar) bar.style.width = current + '%';
        if (pct) pct.textContent = current + '%';

        if (progress < 1) {
            requestAnimationFrame(updateLoader);
        } else {
            isFinished = true;
            if (bar) bar.style.width = '100%';
            if (pct) pct.textContent = '100%';
            setTimeout(finishPreloader, 150);
        }
    }

    requestAnimationFrame(updateLoader);

    // Guaranteed fallback after 1.1s
    setTimeout(() => {
        if (!isFinished) {
            isFinished = true;
            finishPreloader();
        }
    }, 1100);

    // Window load fallback
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('no-scroll');
        }, 400);
    });
})();

/* ---------- 2. GSAP ENTRANCE ANIMATIONS ---------- */
function fireEntranceAnimations() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

    tl.from('.site-header', {
        y: -30,
        opacity: 0,
        duration: 0.8
    })
    .from('.banner-hero-title', {
        opacity: 0,
        scale: 0.96,
        duration: 1.1
    }, '-=0.5')
    .from('.banner-hero-man', {
        y: 60,
        opacity: 0,
        duration: 1.2
    }, '-=0.8')
    .from('.banner-left-card', {
        x: -35,
        opacity: 0,
        duration: 0.9
    }, '-=0.9')
    .from('.banner-center-box', {
        y: 35,
        opacity: 0,
        duration: 0.9
    }, '-=0.8')
    .from('.banner-stat-card', {
        x: 35,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12
    }, '-=0.9');
}

/* ---------- 3. SMOOTH SCROLL REVEAL TRANSITIONS ---------- */
function initScrollReveals() {
    const revealSelectors = [
        '.section-header',
        '.about-statement',
        '.about-grid > *',
        '.service-row',
        '.project-card',
        '.tech-category-group',
        '.timeline-item',
        '.cert-card',
        '.cert-grid > *',
        '.contact-grid > *',
        '.footer-top-grid > *'
    ];

    const allRevealEls = document.querySelectorAll(revealSelectors.join(', '));

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -30px 0px',
            threshold: 0.05
        });

        allRevealEls.forEach((el) => {
            el.classList.add('reveal-item');
            observer.observe(el);
        });

        // Guaranteed safety fallback: Never leave any element hidden
        setTimeout(() => {
            allRevealEls.forEach(el => el.classList.add('in-view'));
        }, 1000);
    } else {
        allRevealEls.forEach(el => el.classList.add('in-view'));
    }
}

/* ---------- 4. ANIMATED NUMBER COUNTERS ---------- */
function initStatsCounters() {
    const counterElements = document.querySelectorAll('.counter-num');
    if (counterElements.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const rawTarget = el.textContent.trim();
                const targetValue = parseFloat(rawTarget);

                if (!isNaN(targetValue)) {
                    const isFloat = rawTarget.includes('.');
                    const decimals = isFloat ? rawTarget.split('.')[1].length : 0;
                    const duration = 1600;
                    const startTime = performance.now();

                    function countUp(now) {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        const currentVal = (targetValue * easeProgress);

                        el.textContent = isFloat ? currentVal.toFixed(decimals) : Math.floor(currentVal);

                        if (progress < 1) {
                            requestAnimationFrame(countUp);
                        } else {
                            el.textContent = isFloat ? targetValue.toFixed(decimals) : targetValue;
                        }
                    }

                    requestAnimationFrame(countUp);
                }
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.2 });

    counterElements.forEach(el => observer.observe(el));
}

/* ---------- 5. MAGNETIC BUTTONS & INTERACTIVE HOVERS ---------- */
(function initMagneticElements() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const magneticSelectors = '.btn-magnetic, .btn-cv-black, .nav-hamburger-box, .chat-fab, .whatsapp-float, .social-icon-btn, .header-social-box';
    const magneticEls = document.querySelectorAll(magneticSelectors);

    magneticEls.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px)';
            el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => {
                el.style.transition = '';
            }, 400);
        });
    });
})();

/* ---------- 6. 3D CARD PERSPECTIVE TILT ---------- */
(function initCardTilt() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const tiltCards = document.querySelectorAll('.project-card, .banner-stat-card, .banner-left-card, .about-metric-card, .cert-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
    });
})();

/* ---------- 7. CUSTOM TRAILING CURSOR ---------- */
(function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    if (window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        function renderRing() {
            ringX += (mouseX - ringX) * 0.2;
            ringY += (mouseY - ringY) * 0.2;
            ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
            requestAnimationFrame(renderRing);
        }
        requestAnimationFrame(renderRing);

        const interactiveEls = 'a, button, input, textarea, .project-card, .service-row, .tech-item, .stat-box, [data-case-study]';
        document.querySelectorAll(interactiveEls).forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
        });
    }
})();

/* ---------- 8. ANIMATED CANVAS BACKGROUND ---------- */
(function initCanvasBackground() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const orbs = [
        { x: width * 0.2, y: height * 0.3, r: 350, vx: 0.4, vy: 0.3, color: 'rgba(184, 255, 34, 0.04)' },
        { x: width * 0.8, y: height * 0.7, r: 420, vx: -0.3, vy: -0.4, color: 'rgba(0, 245, 160, 0.035)' },
        { x: width * 0.5, y: height * 0.5, r: 300, vx: 0.2, vy: -0.3, color: 'rgba(124, 58, 237, 0.03)' }
    ];

    function drawOrbs() {
        ctx.clearRect(0, 0, width, height);

        orbs.forEach(orb => {
            orb.x += orb.vx;
            orb.y += orb.vy;

            if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
            if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

            const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
            gradient.addColorStop(0, orb.color);
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(drawOrbs);
    }

    requestAnimationFrame(drawOrbs);
})();
