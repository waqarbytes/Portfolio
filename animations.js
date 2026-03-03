/* ============================================================
   ANIMATIONS.JS — Simplified & Bulletproof
   Only GSAP for visual polish; everything is visible by default.
   Hero uses CSS class-toggle animations (no GSAP opacity dependency).
   Scroll sections use immediateRender:false so they never get stuck.
   ============================================================ */

/* ============================================================
   0. PRELOADER — percentage counter + skills background
   ============================================================ */
(function runPreloader() {
    const preloader = document.getElementById('preloader');
    const pctEl     = document.getElementById('loaderPct');
    const barEl     = document.getElementById('loaderBar');
    if (!preloader) return;

    document.body.style.overflow = 'hidden';

    let current = 0;
    const duration  = 2200;
    const startTime = performance.now();

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function update(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        current = Math.floor(easeOut(progress) * 100);
        pctEl.textContent = current + '%';
        barEl.style.width = current + '%';

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            pctEl.textContent = '100%';
            barEl.style.width = '100%';
            setTimeout(dismissPreloader, 300);
        }
    }
    requestAnimationFrame(update);

    function dismissPreloader() {
        preloader.classList.add('done');
        setTimeout(() => {
            document.body.style.overflow = '';
            preloader.style.display = 'none';
            fireHeroAnimations();
        }, 950);
    }
})();


/* ============================================================
   HERO ANIMATIONS — called after preloader exits
   ============================================================ */
function fireHeroAnimations() {
    gsap.from('.hero-greeting',    { y: 40, duration: 0.7, delay: 0.1,  ease: 'power3.out', clearProps: 'all' });
    gsap.from('.hero-name',        { y: 60, duration: 0.8, delay: 0.2,  ease: 'power3.out', clearProps: 'all' });
    gsap.from('.hero-role-label',  { y: 30, duration: 0.6, delay: 0.3,  ease: 'power3.out', clearProps: 'all' });
    gsap.from('.hero-roles',       { y: 40, duration: 0.7, delay: 0.35, ease: 'power3.out', clearProps: 'all' });
    gsap.from('.hero-scroll',      { opacity: 0, y: 20, duration: 0.5, delay: 0.5, ease: 'power3.out', clearProps: 'all' });
    gsap.from('.social-sidebar',   { x: -40, opacity: 0, duration: 0.7, delay: 0.4, ease: 'power3.out', clearProps: 'all' });
    gsap.from('.resume-fab',       { x: 40,  opacity: 0, duration: 0.7, delay: 0.4, ease: 'power3.out', clearProps: 'all' });
}


/* ============================================================
   1. CUSTOM CURSOR (GSAP-driven)
   ============================================================ */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', e => {
        gsap.to(cursorDot,  { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(cursorRing, { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
    });
    document.querySelectorAll('a, button, .tech-tile').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
    });
}

/* ============================================================
   2. CANVAS ANIMATED ORB BACKGROUND (30fps throttled)
   ============================================================ */
(function initCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const orbs = [
        { x: 0.80, y: 0.20, r: 420, color: 'rgba(124,58,237,',  alpha: 0.18, vx: 0.00025, vy: 0.00015 },
        { x: 0.15, y: 0.55, r: 320, color: 'rgba(59,130,246,',   alpha: 0.13, vx: -0.0002, vy: 0.00025 },
        { x: 0.50, y: 0.90, r: 260, color: 'rgba(168,85,247,',   alpha: 0.12, vx: 0.00018, vy: -0.0002 },
        { x: 0.85, y: 0.70, r: 300, color: 'rgba(124,58,237,',   alpha: 0.10, vx: -0.00015, vy: 0.0002 },
        { x: 0.25, y: 0.15, r: 280, color: 'rgba(59,130,246,',   alpha: 0.10, vx: 0.0002,  vy: 0.00018 },
    ];

    let t = 0, lastTime = 0;
    const INTERVAL = 1000 / 30; // 30fps

    function draw(timestamp) {
        requestAnimationFrame(draw);
        if (timestamp - lastTime < INTERVAL) return;
        lastTime = timestamp;
        t++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        orbs.forEach(orb => {
            const px = (orb.x + Math.sin(t * orb.vx * 60) * 0.12) * canvas.width;
            const py = (orb.y + Math.cos(t * orb.vy * 60) * 0.12) * canvas.height;
            const g  = ctx.createRadialGradient(px, py, 0, px, py, orb.r);
            g.addColorStop(0,   orb.color + orb.alpha + ')');
            g.addColorStop(0.4, orb.color + (orb.alpha * 0.5) + ')');
            g.addColorStop(1,   orb.color + '0)');
            ctx.beginPath();
            ctx.arc(px, py, orb.r, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
        });
    }
    requestAnimationFrame(draw);
})();

/* ============================================================
   3. REGISTER GSAP PLUGIN
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   5. SCROLL REVEAL — uses immediateRender:false so elements

   are NOT set to opacity:0 until ScrollTrigger fires.
   ============================================================ */

// Helper: scroll reveal for any element
function scrollReveal(selector, vars = {}) {
    gsap.from(selector, {
        opacity: 0,
        y: vars.y ?? 50,
        x: vars.x ?? 0,
        scale: vars.scale ?? 1,
        duration: vars.duration ?? 0.8,
        stagger: vars.stagger ?? 0,
        ease: vars.ease ?? 'power3.out',
        immediateRender: false,  // ← KEY: don't set opacity:0 immediately
        clearProps: 'all',
        scrollTrigger: {
            trigger: vars.trigger ?? selector,
            start: 'top 88%',
            once: true,
        },
    });
}

// About
scrollReveal('.about-img-wrapper', { x: -60, y: 0 });
scrollReveal('.about-stats .stat',  { y: 30, stagger: 0.12, trigger: '.about-stats' });
scrollReveal('.about-heading',      { y: 40 });
scrollReveal('.about-desc',         { y: 30 });
scrollReveal('.about-cta .btn-primary, .about-cta .btn-outline', { y: 20, stagger: 0.12, trigger: '.about-cta' });

// Experience
scrollReveal('.timeline-item', { y: 60, stagger: 0.18, trigger: '.timeline' });

// Glowing dot pulse
gsap.to('.tl-dot', {
    boxShadow: '0 0 30px rgba(168,85,247,0.9), 0 0 60px rgba(168,85,247,0.4)',
    repeat: -1,
    yoyo: true,
    duration: 1.5,
    ease: 'power1.inOut',
    stagger: { each: 0.5 },
});

// Project cards
document.querySelectorAll('.project-card').forEach(card => {
    const isReverse = card.classList.contains('reverse');
    scrollReveal(card.querySelector('.project-image'), { x: isReverse ? 70 : -70, y: 0, trigger: card });
    scrollReveal(card.querySelector('.project-info'),  { x: isReverse ? -70 : 70, y: 0, trigger: card });
    const num = card.querySelector('.project-num');
    if (num) scrollReveal(num, { scale: 0.7, y: 0, trigger: card, ease: 'back.out(1.7)' });
});

// Tech tiles
scrollReveal('.tech-tile', { y: 35, scale: 0.88, stagger: 0.04, trigger: '.tech-grid', ease: 'back.out(1.3)' });

// Footer form
scrollReveal('.footer-form-section', { y: 50 });

// Footer name character split
const footerName = document.querySelector('.footer-name');
if (footerName && footerName.childElementCount === 0) {
    footerName.innerHTML = footerName.textContent
        .split('')
        .map(c => c.trim() ? `<span class="fn-char" style="display:inline-block">${c}</span>` : ' ')
        .join('');
}
scrollReveal('.fn-char', { y: 70, stagger: 0.04, trigger: '.footer-name', ease: 'power3.out' });
scrollReveal('.footer-col', { y: 40, stagger: 0.15, trigger: '.footer-cols' });

/* ============================================================
   6. SECTION HEADINGS
   ============================================================ */
document.querySelectorAll('.section-heading, .section-label').forEach(el => {
    gsap.from(el, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power3.out',
        immediateRender: false,
        clearProps: 'all',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
});

/* ============================================================
   7. NAVBAR MAGNETIC HOVER
   ============================================================ */
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('mousemove', e => {
        const r = link.getBoundingClientRect();
        gsap.to(link, { x: (e.clientX - r.left - r.width/2) * 0.25, y: (e.clientY - r.top - r.height/2) * 0.25, duration: 0.3, ease: 'power2.out' });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(link, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
});

/* ============================================================
   8. REFRESH ON RESIZE
   ============================================================ */
window.addEventListener('resize', () => ScrollTrigger.refresh());
