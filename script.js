
    // Initialize AOS
    AOS.init();
    
    // Navbar Scroll Effect
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
    
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    
    menuBtn.addEventListener('click', function() {
        menu.classList.toggle('active');
        if (menuBtn.innerHTML.includes('fa-bars')) {
            menuBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close menu when clicking menu items
    const menuLinks = document.querySelectorAll('.menu li a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menu.classList.remove('active');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // About Tab Functionality
    function openTab(tabName) {
        const tabContents = document.querySelectorAll('.tab-contents');
        const tabLinks = document.querySelectorAll('.tab-links');
        
        tabContents.forEach(content => {
            content.classList.remove('active-tab');
        });
        
        tabLinks.forEach(link => {
            link.classList.remove('active-link');
        });
        
        document.getElementById(tabName + '-tab').classList.add('active-tab');
        event.currentTarget.classList.add('active-link');
    }
    
    // Typed.js Animation
    const typedOptions = {
        strings: ['Web Developer', 'Frontend Developer', 'Backend Developer', 'AI/ML Enthusiast'],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    };
    
    if (typeof Typed !== 'undefined') {
        new Typed('.hero-text h2', typedOptions);
    }
    
    // Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation and submission logic would go here
            // This is a placeholder
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });