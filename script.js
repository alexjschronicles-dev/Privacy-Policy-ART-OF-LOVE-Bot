/**
 * LOVE OF ART BOT — Enterprise Privacy Portal
 * script.js — Premium Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. PARTICLE BACKGROUND
       ========================================== */
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.5 ? 260 : 220; // purple or blue
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const force = (200 - dist) / 200 * 0.05;
                this.x -= dx * force;
                this.y -= dy * force;
            }
            // Wrap around
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(Math.floor(canvas.width * canvas.height / 12000), 80);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `hsla(260, 60%, 70%, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animationId = requestAnimationFrame(animateParticles);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Touch support
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
    }, { passive: true });

    initParticles();
    animateParticles();

    // Re-init on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            cancelAnimationFrame(animationId);
            resizeCanvas();
            initParticles();
            animateParticles();
        }, 300);
    });

    /* ==========================================
       2. NAVBAR SCROLL EFFECT
       ========================================== */
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    /* ==========================================
       3. MOBILE MENU TOGGLE
       ========================================== */
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    mobileToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });

    /* ==========================================
       4. ACTIVE NAV LINK ON SCROLL
       ========================================== */
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            const bottom = top + section.offsetHeight;
            if (window.pageYOffset >= top && window.pageYOffset < bottom) {
                current = section.getAttribute('id');
            }
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }, { passive: true });

    /* ==========================================
       5. ANIMATED COUNTERS
       ========================================== */
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            const duration = 2000;
            const startTime = performance.now();
            const isFloat = target % 1 !== 0;

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * target;

                counter.textContent = isFloat ? current.toFixed(2) : Math.floor(current);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = isFloat ? target.toFixed(2) : target;
                }
            }

            requestAnimationFrame(update);
        });
    }

    /* ==========================================
       6. SCROLL REVEAL (Intersection Observer)
       ========================================== */
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal-up');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Animate counters when metrics section is revealed
                    if (entry.target.closest('#metrics') || entry.target.closest('.metrics')) {
                        animateCounters();
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    initRevealAnimations();

    /* ==========================================
       7. FAQ ACCORDION
       ========================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ==========================================
       8. TIMELINE ANIMATION
       ========================================== */
    function animateTimeline() {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        const items = timeline.querySelectorAll('.timeline-item');
        const progress = document.getElementById('timelineProgress');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('active');
                            if (progress) {
                                const pct = ((index + 1) / items.length) * 100;
                                const maxHeight = (index + 1) * (items[0].offsetHeight);
                                progress.style.height = Math.min(maxHeight, (index + 1) * 60) + 'px';
                            }
                        }, index * 300);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(timeline);
    }

    animateTimeline();

    /* ==========================================
       9. BACK TO TOP BUTTON
       ========================================== */
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ==========================================
       10. SMOOTH SCROLL FOR ANCHOR LINKS
       ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ==========================================
       11. SECURITY STATUS GLOW ANIMATION
       ========================================== */
    const statusDots = document.querySelectorAll('.status-up');
    statusDots.forEach(dot => {
        setInterval(() => {
            dot.style.textShadow = '0 0 8px rgba(16, 185, 129, 0.5)';
            setTimeout(() => {
                dot.style.textShadow = 'none';
            }, 1000);
        }, 3000);
    });

    /* ==========================================
       12. PERFORMANCE OPTIMIZATION
       ========================================== */
    // Debounce scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Active nav link update is already handled
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Reduce particle count on mobile
    function checkPerformance() {
        if (window.innerWidth < 768) {
            // Already handled in initParticles with lower density
        }
    }

    checkPerformance();

    console.log('🔒 LOVE OF ART BOT — Enterprise Privacy Portal loaded successfully');
});
