/* ============================================
   LOVE OF ART BOT — Privacy Policy Scripts
   Mobile Menu · Smooth Scroll · Scroll Reveal ·
   Navbar Scroll Effect · Back to Top
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* — Cache DOM elements — */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.navbar__link');
    const backToTop = document.getElementById('backToTop');
    const reveals = document.querySelectorAll('.reveal');

    /* ==========================================
       MOBILE MENU
       ========================================== */
    const toggleMenu = (open) => {
        const isOpen = open !== undefined ? open : !navMenu.classList.contains('active');
        navMenu.classList.toggle('active', isOpen);
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () => toggleMenu());

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only close for same-page hash links
            if (link.getAttribute('href').startsWith('#')) {
                toggleMenu(false);
            }
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            toggleMenu(false);
        }
    });

    /* ==========================================
       SMOOTH SCROLLING
       ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 16;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    /* ==========================================
       NAVBAR SCROLL EFFECT
       ========================================== */
    let lastScroll = 0;

    const handleNavScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
        lastScroll = scrollY;
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    // Set initial state
    handleNavScroll();

    /* ==========================================
       SCROLL REVEAL ANIMATIONS
       ========================================== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));

    /* ==========================================
       BACK TO TOP BUTTON
       ========================================== */
    const handleBackToTop = () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==========================================
       PERFORMANCE: Add loading class
       ========================================== */
    document.body.classList.add('loaded');

});
