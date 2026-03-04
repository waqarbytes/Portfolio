// Navbar scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close nav when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// Hero role cycling (CSS animation handles visual, JS sets up multiple span lines)
const roles = ['WEB DEVELOPER', 'AI/ML ENGINEER', 'AI ASSISTANT DEV', 'FULL-STACK DEV'];
const roleEl = document.getElementById('heroRole');
if (roleEl) {
    // Create additional spans for the CSS animation
    const wrapper = roleEl.parentElement;
    wrapper.innerHTML = '';
    roles.forEach(r => {
        const span = document.createElement('span');
        span.className = 'role-text';
        span.textContent = r;
        wrapper.appendChild(span);
    });

    // Apply keyframes dynamically based on count
    const count = roles.length;
    const pct = 100 / count;
    let kf = '';
    roles.forEach((_, i) => {
        const start = i * pct;
        const hold = start + (pct * 0.7);
        const end = (i + 1) * pct;
        kf += `${start.toFixed(1)}%, ${hold.toFixed(1)}% { transform: translateY(-${i * 100}%); }\n`;
    });
    const style = document.createElement('style');
    style.textContent = `@keyframes roleSlide { ${kf} }`;
    document.head.appendChild(style);

    // Adjust wrapper height to show only first role
    wrapper.style.height = wrapper.firstElementChild
        ? getComputedStyle(wrapper.firstElementChild).lineHeight
        : '1em';
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});