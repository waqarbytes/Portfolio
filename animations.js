/* ============================================================
   1. SMOOTH SCROLL — handled natively via CSS scroll-behavior: smooth
   No JS smooth scroll library needed (avoids lag on local files)
   ============================================================ */


/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.innerWidth > 768) {
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
        dotX = e.clientX;
        dotY = e.clientY;
        gsap.to(cursorDot, { x: dotX, y: dotY, duration: 0.1, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(cursorRing, { x: dotX, y: dotY, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
    });

    // Enlarge cursor on hoverable elements
    const hoverables = document.querySelectorAll('a, button, .tech-tile, .project-card, .nav-links li a, .social-sidebar a');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
    });
}

/* ============================================================
   3. CANVAS ANIMATED ORB BACKGROUND (30fps throttled)
   Orbs cover full viewport — visible at every scroll position
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

    // 5 orbs spread across viewport corners and center
    // so no matter where you scroll, at least 2 orbs are glowing
    const orbs = [
        { x: 0.80, y: 0.20, r: 420, color: 'rgba(124,58,237,',  alpha: 0.18, vx: 0.00025, vy: 0.00015 },
        { x: 0.15, y: 0.55, r: 320, color: 'rgba(59,130,246,',   alpha: 0.13, vx: -0.0002, vy: 0.00025 },
        { x: 0.50, y: 0.90, r: 260, color: 'rgba(168,85,247,',   alpha: 0.12, vx: 0.00018, vy: -0.0002 },
        { x: 0.85, y: 0.70, r: 300, color: 'rgba(124,58,237,',   alpha: 0.10, vx: -0.00015, vy: 0.0002 },
        { x: 0.25, y: 0.15, r: 280, color: 'rgba(59,130,246,',   alpha: 0.10, vx: 0.0002,  vy: 0.00018 },
    ];

    let t = 0;
    let lastTime = 0;
    const FPS = 30;
    const INTERVAL = 1000 / FPS;

    function draw(timestamp) {
        requestAnimationFrame(draw);
        const delta = timestamp - lastTime;
        if (delta < INTERVAL) return;
        lastTime = timestamp - (delta % INTERVAL);
        t += 1;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        orbs.forEach(orb => {
            const px = (orb.x + Math.sin(t * orb.vx * 60) * 0.12) * canvas.width;
            const py = (orb.y + Math.cos(t * orb.vy * 60) * 0.12) * canvas.height;

            const gradient = ctx.createRadialGradient(px, py, 0, px, py, orb.r);
            gradient.addColorStop(0,   orb.color + orb.alpha + ')');
            gradient.addColorStop(0.4, orb.color + (orb.alpha * 0.5) + ')');
            gradient.addColorStop(1,   orb.color + '0)');

            ctx.beginPath();
            ctx.arc(px, py, orb.r, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        });
    }

    requestAnimationFrame(draw);
})();

/* ============================================================
   4. GSAP: REGISTER PLUGIN + SET INITIAL STATES
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

// Set initial hidden states via JS (not CSS) so content is visible if JS fails
gsap.set('header', { opacity: 0 });
gsap.set('.about-content', { opacity: 0 });
gsap.set('.timeline', { opacity: 0 });
gsap.set('.project-card', { opacity: 0 });
gsap.set('.tech-grid', { opacity: 0 });
gsap.set('.footer-form-section', { opacity: 0 });
// Social sidebar and resume — hidden initially for hero entrance
gsap.set('.social-sidebar', { opacity: 0, x: -20 });
gsap.set('.resume-fab', { opacity: 0, x: 20 });

/* ============================================================
   5. NAVBAR ENTRANCE
   ============================================================ */
gsap.to('header', {
    opacity: 1,
    duration: 0.8,
    delay: 0.1,
    ease: 'power2.out',
});

/* ============================================================
   6. HERO SECTION — STAGGERED TEXT ENTRANCE
   ============================================================ */
const heroTL = gsap.timeline({
    delay: 0.3,
    onComplete: () => {
        // Safety net: always make sidebar + resume visible after hero
        gsap.set('.social-sidebar', { opacity: 1, x: 0 });
        gsap.set('.resume-fab', { opacity: 1, x: 0 });
    }
});

heroTL
    .from('.hero-greeting', {
        opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
    })
    .from('.hero-name', {
        opacity: 0, y: 60, duration: 0.9, ease: 'power3.out', skewX: -3,
    }, '-=0.4')
    .from('.hero-role-label', {
        opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
    }, '-=0.5')
    .from('.hero-roles', {
        opacity: 0, y: 40, duration: 0.7, ease: 'power3.out',
    }, '-=0.4')
    .from('.hero-scroll', {
        opacity: 0, y: 20, duration: 0.5, ease: 'power3.out',
    }, '-=0.3')
    .to('.social-sidebar', {
        opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
    }, '-=0.4')
    .to('.resume-fab', {
        opacity: 1, x: 0, duration: 0.5, ease: 'power3.out',
    }, '<');

/* ============================================================
   7. ABOUT SECTION — SCROLL REVEAL
   ============================================================ */
/* Reveal container first, then animate children */
ScrollTrigger.create({
    trigger: '.about',
    start: 'top 80%',
    once: true,
    onEnter: () => {
        gsap.to('.about-content', { opacity: 1, duration: 0.01 });
        gsap.from('.about-img-wrapper', { opacity: 0, x: -60, duration: 1, ease: 'power3.out' });
        gsap.from('.about-stats .stat', { opacity: 0, y: 30, duration: 0.6, stagger: 0.15, ease: 'power3.out', delay: 0.4 });
        gsap.from('.about-text-col .section-label', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out', delay: 0.2 });
        gsap.from('.about-heading', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', delay: 0.3 });
        gsap.from('.about-desc', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', delay: 0.5 });
        gsap.from('.about-cta .btn-primary, .about-cta .btn-outline', { opacity: 0, y: 20, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.6 });
    }
});

/* ============================================================
   8. EXPERIENCE TIMELINE — SCROLL REVEAL
   ============================================================ */
ScrollTrigger.create({
    trigger: '.experience',
    start: 'top 80%',
    once: true,
    onEnter: () => {
        gsap.to('.timeline', { opacity: 1, duration: 0.01 });
        gsap.from('.timeline-item', { opacity: 0, y: 60, duration: 0.9, stagger: 0.2, ease: 'power3.out', delay: 0.1 });
    }
});


// Glowing dot pulse animation
gsap.to('.tl-dot', {
    boxShadow: '0 0 30px rgba(168,85,247,0.9), 0 0 60px rgba(168,85,247,0.5)',
    repeat: -1,
    yoyo: true,
    duration: 1.5,
    ease: 'power1.inOut',
    stagger: 0.5,
});

/* ============================================================
   9. PROJECT CARDS — SCROLL REVEAL
   ============================================================ */
document.querySelectorAll('.project-card').forEach((card) => {
    const isReverse = card.classList.contains('reverse');
    ScrollTrigger.create({
        trigger: card,
        start: 'top 82%',
        once: true,
        onEnter: () => {
            gsap.to(card, { opacity: 1, duration: 0.01 });
            gsap.from(card.querySelector('.project-image'), {
                opacity: 0, x: isReverse ? 80 : -80, duration: 1, ease: 'power3.out'
            });
            gsap.from(card.querySelector('.project-info'), {
                opacity: 0, x: isReverse ? -80 : 80, duration: 1, ease: 'power3.out'
            });
            const numEl = card.querySelector('.project-num');
            if (numEl) gsap.from(numEl, { opacity: 0, scale: 0.6, duration: 0.8, ease: 'back.out(1.7)' });
        }
    });
});


/* ============================================================
   10. TECH STACK — STAGGERED TILE REVEAL
   ============================================================ */
/* ============================================================
   10. TECH STACK — STAGGERED TILE REVEAL
   ============================================================ */
ScrollTrigger.create({
    trigger: '.techstack',
    start: 'top 80%',
    once: true,
    onEnter: () => {
        gsap.to('.tech-grid', { opacity: 1, duration: 0.01 });
        gsap.from('.tech-tile', {
            opacity: 0,
            y: 40,
            scale: 0.85,
            duration: 0.45,
            stagger: { from: 'start', amount: 0.8 },
            ease: 'back.out(1.4)',
        });
    }
});

/* ============================================================
   11. FOOTER / CONTACT — SCROLL REVEAL
   ============================================================ */
ScrollTrigger.create({
    trigger: '.footer',
    start: 'top 85%',
    once: true,
    onEnter: () => {
        gsap.to('.footer-form-section', { opacity: 1, duration: 0.01 });
        gsap.from('.footer-form-section', { opacity: 0, y: 60, duration: 1, ease: 'power3.out', delay: 0.05 });
    }
});


// Footer name reveal — split per character using a clip reveal
const footerName = document.querySelector('.footer-name');
if (footerName) {
    const text = footerName.textContent;
    footerName.innerHTML = text.split('').map(c => c === ' ' ? ' ' : `<span class="fn-char" style="display:inline-block;">${c}</span>`).join('');
    gsap.from('.fn-char', {
        opacity: 0,
        y: 80,
        rotateX: -40,
        duration: 0.7,
        stagger: { amount: 0.6 },
        ease: 'power3.out',
        scrollTrigger: { trigger: footerName, start: 'top 80%', once: true }
    });
}

gsap.from('.footer-col', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.footer-cols', start: 'top 80%', once: true }
});

/* ============================================================
   12. SECTION HEADINGS — CLIP REVEAL
   ============================================================ */
document.querySelectorAll('.section-heading').forEach(heading => {
    gsap.from(heading, {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: heading, start: 'top 80%', once: true }
    });
});

document.querySelectorAll('.section-label').forEach(label => {
    gsap.from(label, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: label, start: 'top 85%', once: true }
    });
});

/* ============================================================
   13. NAVBAR LINK HOVER — MAGNETIC EFFECT (subtle)
   ============================================================ */
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('mousemove', e => {
        const rect = link.getBoundingClientRect();
        const mx = e.clientX - rect.left - rect.width / 2;
        const my = e.clientY - rect.top  - rect.height / 2;
        gsap.to(link, { x: mx * 0.2, y: my * 0.2, duration: 0.3, ease: 'power2.out' });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(link, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
    });
});

/* ============================================================
   14. REFRESH SCROLLTRIGGER ON RESIZE
   ============================================================ */
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
