document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        mouseMultiplier: 1,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Custom Cursor
    const cursor = document.getElementById('cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX - 10,
                y: e.clientY - 10,
                duration: 0.1
            });
        });

        // Cursor hover effects
        const interactiveElements = document.querySelectorAll('a, button, .service-card-stack, .portfolio-card, .menu-toggle, .overlay-close');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 3, opacity: 0.5 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, opacity: 1 });
            });
        });
    }

    // 3. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    const setTheme = (theme) => {
        const isLight = theme === 'light';
        document.body.classList.toggle('light-theme', isLight);
        
        if (themeToggle) {
            themeToggle.innerHTML = isLight 
                ? '<i data-lucide="moon" id="theme-icon"></i>' 
                : '<i data-lucide="sun" id="theme-icon"></i>';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        
        localStorage.setItem('gsx-theme', theme);
    };

    // Load saved theme
    const savedTheme = localStorage.getItem('gsx-theme') || 'dark';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
            setTheme(currentTheme);
        });
    }

    // 4. Menu Toggle Logic — Open with hamburger, Close with X inside overlay
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const menuOverlay = document.getElementById('menu-overlay');

    function openMenu() {
        if (menuToggleBtn) menuToggleBtn.classList.add('open');
        if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'true');
        if (menuOverlay) {
            menuOverlay.classList.add('active');
            menuOverlay.setAttribute('aria-hidden', 'false');
        }
        lenis.stop();
    }

    function closeMenu() {
        if (menuToggleBtn) menuToggleBtn.classList.remove('open');
        if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'false');
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
            menuOverlay.setAttribute('aria-hidden', 'true');
        }
        lenis.start();
    }

    // Click hamburger to open
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', () => {
            const isOpen = menuToggleBtn.classList.contains('open');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }



    // Also close when clicking a nav link inside overlay
    if (menuOverlay) {
        const overlayLinks = menuOverlay.querySelectorAll('.overlay-nav a');
        overlayLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });

    // 5. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations
    const heroTl = gsap.timeline();
    if (document.querySelector('.hero-title')) {
        heroTl.from('.hero-title', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' })
              .from('.hero-sub', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.5')
              .from('.hero-btns', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.5')
              .from('.hero-social-proof', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.3');
    }

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            onEnter: () => {
                let count = 0;
                const updateCount = () => {
                    const increment = target / 100;
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            }
        });
    });

    // Scroll Reveals for sticky service cards
    const serviceCards = document.querySelectorAll('.service-card-stack');
    serviceCards.forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 60,
            duration: 0.8,
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Scroll Reveals for portfolio and timeline process
    const reveals = document.querySelectorAll('.process-step, .portfolio-card, .timeline-card');
    reveals.forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Timeline Dashed Line Animation
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
        gsap.to('.timeline-container', {
            scrollTrigger: {
                trigger: '.timeline-container',
                start: 'top 70%',
                end: 'bottom 50%',
                scrub: 1
            },
            '--line-height': '100%',
            ease: 'none'
        });
    }

    // 6. Draggable Testimonials & Services & Work Sliders
    const testimonialsSlider = document.getElementById('testimonials-slider');
    const testimonialsTrack = document.getElementById('testimonials-track');
    
    const servicesSlider = document.getElementById('services-slider-element');
    const workSlider = document.getElementById('work-slider-element');
    
    function initDrag(slider, track, paddingRight = 30) {
        if (!slider) return;
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('dragging');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            if (track) track.style.transition = 'none';
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('dragging');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('dragging');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });

        // Touch support
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        }, { passive: true });

        // Make slider horizontally scrollable
        slider.style.overflowX = 'auto';
        slider.style.scrollbarWidth = 'none'; // Firefox
        slider.style.msOverflowStyle = 'none'; // IE
    }

    if (window.innerWidth <= 768) {
        initDrag(testimonialsSlider, testimonialsTrack, 100);
        initDrag(servicesSlider, servicesSlider, 100);
        initDrag(workSlider, workSlider, 100);
    } else {
        initDrag(testimonialsSlider, testimonialsTrack, 30);
        initDrag(servicesSlider, servicesSlider, 30);
        initDrag(workSlider, workSlider, 30);
    }

    // 7. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // 8. Lucide Icons re-init
    if (typeof lucide !== 'undefined') lucide.createIcons();
});
