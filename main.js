document.addEventListener('DOMContentLoaded', () => {
    // 0. Opening preloader — simple timed intro before the page reveals
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const countEl = document.getElementById('preloader-count');
        document.body.classList.add('preloading');

        const duration = 1100;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min(1, (now - start) / duration);
            const pct = Math.round(progress * 100);
            if (countEl) countEl.textContent = pct + '%';

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                document.body.classList.remove('preloading');
                preloader.classList.add('hide');
                setTimeout(() => preloader.remove(), 700);
            }
        }
        requestAnimationFrame(tick);
    }

    // After the initial loading moment, turn the hero skeleton into a welcome message.
    const growthSnapshot = document.querySelector('.stack-top-right');
    if (growthSnapshot) {
        window.setTimeout(() => growthSnapshot.classList.add('is-welcomed'), 5000);
    }

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        mouseMultiplier: 1,
    });

   
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Give grid-based backgrounds a restrained 3D response to the cursor.
    document.querySelectorAll('.grid-interactive').forEach(section => {
        const gridLayer = section.querySelector('.interactive-grid-layer');
        if (!gridLayer || window.matchMedia('(pointer: coarse)').matches) return;

        section.addEventListener('pointermove', event => {
            const bounds = section.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            gridLayer.style.setProperty('--grid-shift-x', `${x * 20}px`);
            gridLayer.style.setProperty('--grid-shift-y', `${y * 16}px`);
            gridLayer.style.setProperty('--grid-rotate-x', `${-y * 3}deg`);
            gridLayer.style.setProperty('--grid-rotate-y', `${x * 3}deg`);
        });

        section.addEventListener('pointerleave', () => {
            gridLayer.style.removeProperty('--grid-shift-x');
            gridLayer.style.removeProperty('--grid-shift-y');
            gridLayer.style.removeProperty('--grid-rotate-x');
            gridLayer.style.removeProperty('--grid-rotate-y');
        });
    });

   
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
    const savedTheme = localStorage.getItem('gsx-theme') || 'light';
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

    // Section content slides into place as it enters the viewport, with a
    // compact MangoByte colour highlight marking the active reading area.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const highlightGroups = [
        document.querySelector('.services-stack-heading'),
        document.querySelector('.process-dial-heading'),
        document.querySelector('#portfolio > .container'),
        document.querySelector('.testimonials-section > .container'),
        document.querySelector('.faq-section .container')
    ].filter(Boolean);

    highlightGroups.forEach(group => {
        group.classList.add('scroll-highlight-group');
        const content = Array.from(group.querySelectorAll('h2, p, .btn'));

        ScrollTrigger.create({
            trigger: group,
            start: 'top 72%',
            end: 'bottom 32%',
            toggleClass: { targets: group, className: 'is-scroll-highlighted' }
        });

        if (!reducedMotion && content.length) {
            gsap.fromTo(content,
                { autoAlpha: 0, y: 28 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: group,
                        start: 'top 78%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }
    });

    document.querySelectorAll('.service-block').forEach(block => {
        const copy = Array.from(block.querySelectorAll('.service-block-text > *'));
        const visual = block.querySelector('.service-block-img');

        ScrollTrigger.create({
            trigger: block,
            start: 'top 72%',
            end: 'bottom 32%',
            toggleClass: { targets: block, className: 'is-scroll-highlighted' }
        });

        if (!reducedMotion) {
            if (copy.length) {
                gsap.fromTo(copy,
                    { autoAlpha: 0, x: -34 },
                    {
                        autoAlpha: 1,
                        x: 0,
                        duration: 0.65,
                        stagger: 0.08,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: block,
                            start: 'top 78%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }

            if (visual) {
                gsap.fromTo(visual,
                    { autoAlpha: 0, x: 46 },
                    {
                        autoAlpha: 1,
                        x: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: block,
                            start: 'top 78%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }
        }
    });

    // Hero Animations
    const heroTl = gsap.timeline();
    if (document.querySelector('.hero-title')) {
        heroTl.from('.hero-title', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' })
              .from('.hero-sub', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.5')
              .from('.hero-btns', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.5')
              .from('.hero-social-proof', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.3');
    }

    // Hero gallery: a selected orbit image flies into the featured rectangle.
    const heroOrbitFeature = document.getElementById('hero-orbit-feature');
    const heroOrbitItems = Array.from(document.querySelectorAll('.hero-orbit-item'));
    if (heroOrbitFeature && heroOrbitItems.length) {
        const featureImage = heroOrbitFeature.querySelector('img');

        heroOrbitItems.forEach(item => {
            item.setAttribute('aria-pressed', 'false');
            item.addEventListener('click', () => {
                const sourceImage = item.querySelector('img');
                if (!sourceImage || !featureImage) return;

                heroOrbitItems.forEach(other => {
                    const selected = other === item;
                    other.classList.toggle('is-selected', selected);
                    other.setAttribute('aria-pressed', String(selected));
                });

                const sourceRect = sourceImage.getBoundingClientRect();
                const targetRect = heroOrbitFeature.getBoundingClientRect();
                const flightImage = sourceImage.cloneNode(true);
                flightImage.className = 'hero-orbit-flight';
                flightImage.style.left = `${sourceRect.left}px`;
                flightImage.style.top = `${sourceRect.top}px`;
                flightImage.style.width = `${sourceRect.width}px`;
                flightImage.style.height = `${sourceRect.height}px`;
                document.body.appendChild(flightImage);

                heroOrbitFeature.classList.add('is-changing');
                requestAnimationFrame(() => {
                    flightImage.style.left = `${targetRect.left}px`;
                    flightImage.style.top = `${targetRect.top}px`;
                    flightImage.style.width = `${targetRect.width}px`;
                    flightImage.style.height = `${targetRect.height}px`;
                    flightImage.style.borderRadius = '18px';
                });

                window.setTimeout(() => {
                    featureImage.src = sourceImage.currentSrc || sourceImage.src;
                    featureImage.alt = sourceImage.alt;
                    heroOrbitFeature.classList.remove('is-empty');
                    heroOrbitFeature.classList.remove('is-changing');
                    flightImage.style.opacity = '0';
                    window.setTimeout(() => flightImage.remove(), 180);
                }, 560);
            });
        });
    }

    
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

    const processPin = document.getElementById('process-pin');
    const processSection = document.querySelector('.process-dial-section');
    const processDialWheel = document.getElementById('process-dial-wheel');
    const processDialNumbers = processDialWheel ? Array.from(processDialWheel.querySelectorAll('.process-dial-number')) : [];
    const processDialPanels = Array.from(document.querySelectorAll('.process-dial-panel'));

    if (processPin && processDialWheel && processDialNumbers.length && processDialPanels.length) {
        const stepCount = processDialNumbers.length;
        const anglePerStep = 360 / stepCount;
        let activeProcessStep = -1;

        const setProcessStep = (step, rotation = -step * anglePerStep) => {
            const nextStep = Math.max(0, Math.min(stepCount - 1, step));
            gsap.set(processDialWheel, { rotation });
            const isEndpoint = nextStep === 0 || nextStep === stepCount - 1;
            processDialNumbers.forEach((number, index) => {
                const label = number.querySelector('span');
                if (label) {
                    const offset = isEndpoint && index === nextStep ? ' translateY(-42px)' : '';
                    label.style.transform = `rotate(${-rotation}deg)${offset}`;
                }
            });
            processPin.style.setProperty('--active-step', nextStep);

            if (nextStep === activeProcessStep && processDialPanels[nextStep] && !processDialPanels[nextStep].hidden) return;
            activeProcessStep = nextStep;

            processDialNumbers.forEach((number, index) => {
                const isActive = index === nextStep;
                number.classList.toggle('is-active', isActive);
                number.toggleAttribute('aria-current', isActive);
            });
            processDialPanels.forEach((panel, index) => {
                const isActive = index === nextStep;
                panel.hidden = !isActive;
                panel.classList.toggle('is-active', isActive);
            });
        };

        processDialNumbers.forEach((number, index) => {
            number.addEventListener('click', () => setProcessStep(index));
        });
        setProcessStep(0);

        if (window.innerWidth > 768 && processSection) {
            ScrollTrigger.create({
                trigger: processSection,
                start: 'top top',
                end: () => `+=${window.innerHeight * 4.5}`,
                pin: processSection,
                scrub: 1,
                anticipatePin: 1,
                onUpdate: self => {
                    const progress = self.progress;
                    // Keep the current content in place until the next
                    // number reaches the center marker on the dial.
                    const step = Math.min(stepCount - 1, Math.floor(progress * (stepCount - 1) + 0.0001));
                    setProcessStep(step, -progress * anglePerStep * (stepCount - 1));
                }
            });
        }
    }

    // Case studies — infinite arc/spiral carousel (scroll-driven + prev/next buttons)
    const caseStudiesSection = document.getElementById('portfolio');
    const motionPin = document.getElementById('motion-pin');
    const motionCards = motionPin ? Array.from(motionPin.querySelectorAll('.motion-card')) : [];
    const motionPrevBtn = document.getElementById('motion-prev');
    const motionNextBtn = document.getElementById('motion-next');

    if (motionPin && motionCards.length && window.innerWidth > 768) {
        const total = motionCards.length;
        const spread = 15; // degrees between neighboring cards
        const radius = 1000;
        let currentOffset = 0;

        const layoutArc = offset => {
            motionCards.forEach((card, i) => {
                let rel = (i - offset) % total;
                if (rel > total / 2) rel -= total;
                if (rel < -total / 2) rel += total;

                const angle = rel * spread;
                const rad = angle * Math.PI / 180;
                const x = Math.sin(rad) * radius;
                const y = (1 - Math.cos(rad)) * radius * 0.55;
                const rotate = angle * 0.55;
                const absAngle = Math.abs(angle);
                const scale = Math.max(1 - absAngle / 110, 0.6);
                const opacity = Math.max(1 - absAngle / 75, 0.08);
                gsap.set(card, {
                    x, y, rotate, scale, opacity,
                    zIndex: 100 - Math.round(absAngle)
                });
            });
        };

        layoutArc(0);

        const caseStudiesPinTarget = caseStudiesSection || motionPin;

        ScrollTrigger.create({
            trigger: caseStudiesPinTarget,
            start: 'top top',
            end: () => `+=${caseStudiesPinTarget.offsetHeight * 2.5}`,
            pin: caseStudiesPinTarget,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: self => {
                currentOffset = self.progress * total;
                layoutArc(currentOffset);
            }
        });

        const step = dir => {
            const proxy = { val: currentOffset };
            gsap.to(proxy, {
                val: currentOffset + dir,
                duration: 0.6,
                ease: 'power2.out',
                onUpdate: () => layoutArc(proxy.val),
                onComplete: () => { currentOffset = proxy.val; }
            });
        };

        if (motionPrevBtn) motionPrevBtn.addEventListener('click', () => step(-1));
        if (motionNextBtn) motionNextBtn.addEventListener('click', () => step(1));
    } else if (motionPrevBtn && motionNextBtn) {
        // Mobile fallback: buttons scroll the horizontal strip instead
        const scrollAmount = 260;
        motionPrevBtn.addEventListener('click', () => motionPin.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
        motionNextBtn.addEventListener('click', () => motionPin.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
    }

    // Testimonials — infinite vertical center-scroll selector
    const testiList = null;
    if (testiList) {
        const originals = Array.from(testiList.querySelectorAll('.testimonials-person'));

        // Triple the list (before/original/after) so there's always real
        // content above and below — no empty gap at the ends, ever.
        const beforeFrag = document.createDocumentFragment();
        originals.forEach(p => beforeFrag.appendChild(p.cloneNode(true)));
        testiList.insertBefore(beforeFrag, testiList.firstChild);

        const afterFrag = document.createDocumentFragment();
        originals.forEach(p => afterFrag.appendChild(p.cloneNode(true)));
        testiList.appendChild(afterFrag);

        const people = Array.from(testiList.querySelectorAll('.testimonials-person'));
        const testiTitle = document.getElementById('testimonial-title');
        const testiText = document.getElementById('testimonial-text');
        const testiUpBtn = document.getElementById('testi-scroll-up');
        const testiDownBtn = document.getElementById('testi-scroll-down');

        const setHeight = testiList.scrollHeight / 3;

        // Start centered on the first real (middle-set) item. Measured via
        // getBoundingClientRect (not offsetTop, which is relative to the
        // nearest positioned ancestor — not necessarily this list) while
        // scrollTop is still 0, so the delta is purely intra-list.
        const firstReal = people[originals.length];
        const listRect0 = testiList.getBoundingClientRect();
        const itemRect0 = firstReal.getBoundingClientRect();
        const relativeTop = itemRect0.top - listRect0.top;
        testiList.scrollTop = relativeTop + itemRect0.height / 2 - testiList.clientHeight / 2;

        const updateActiveTestimonial = () => {
            const listRect = testiList.getBoundingClientRect();
            const centerY = listRect.top + listRect.height / 2;
            let closest = null;
            let closestDist = Infinity;
            people.forEach(person => {
                const r = person.getBoundingClientRect();
                const dist = Math.abs((r.top + r.height / 2) - centerY);
                if (dist < closestDist) {
                    closestDist = dist;
                    closest = person;
                }
            });
            people.forEach(p => p.classList.toggle('active', p === closest));
            if (closest && testiTitle && testiText) {
                testiTitle.textContent = closest.dataset.title;
                testiText.textContent = closest.dataset.text;
            }
        };

        let testiScrollTicking = false;
        testiList.addEventListener('scroll', () => {
            if (testiScrollTicking) return;
            testiScrollTicking = true;
            requestAnimationFrame(() => {
                // Loop correction: jump by exactly one set-height when drifting
                // into the clone regions — content is identical, so it's seamless.
                if (testiList.scrollTop < setHeight) {
                    testiList.scrollTop += setHeight;
                } else if (testiList.scrollTop > setHeight * 2) {
                    testiList.scrollTop -= setHeight;
                }
                updateActiveTestimonial();
                testiScrollTicking = false;
            });
        });

        people.forEach(person => {
            person.addEventListener('click', () => {
                person.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });

        if (testiUpBtn) {
            testiUpBtn.addEventListener('click', () => testiList.scrollBy({ top: -100, behavior: 'smooth' }));
        }
        if (testiDownBtn) {
            testiDownBtn.addEventListener('click', () => testiList.scrollBy({ top: 100, behavior: 'smooth' }));
        }

        updateActiveTestimonial();
    }

    // Testimonials — scattered cards move smoothly into the centre when selected.
    const testimonialStage = document.querySelector('.testimonials-stage');
    if (testimonialStage) {
        const testimonialCards = Array.from(testimonialStage.querySelectorAll('.testimonial-card'));

        testimonialCards.forEach(card => {
            card.addEventListener('click', () => {
                testimonialCards.forEach(otherCard => {
                    const isSelected = otherCard === card;
                    otherCard.classList.toggle('is-centered', isSelected);
                    otherCard.setAttribute('aria-pressed', String(isSelected));
                });
            });
        });
    }

    // 6. Draggable Services & Work Sliders
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
        initDrag(servicesSlider, servicesSlider, 100);
        initDrag(workSlider, workSlider, 100);
    } else {
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

    // 9. Bar frames — follow cursor height, but only inside their own frame
    // (used for both the footer bars and the hero "50+ businesses" accent card)
    function initInteractiveBars(frame) {
        if (!frame) return;
        const bars = Array.from(frame.querySelectorAll('.bar'));
        const influenceRadius = 160; // px, how far a bar reacts from the cursor's x position

        document.addEventListener('mousemove', (e) => {
            const frameRect = frame.getBoundingClientRect();
            const inside = e.clientX >= frameRect.left && e.clientX <= frameRect.right &&
                            e.clientY >= frameRect.top && e.clientY <= frameRect.bottom;

            if (!inside) {
                if (frame.classList.contains('interactive')) {
                    frame.classList.remove('interactive');
                    bars.forEach(bar => { bar.style.height = ''; bar.style.opacity = ''; });
                }
                return;
            }

            frame.classList.add('interactive');
            const mouseHeightRatio = 1 - (e.clientY - frameRect.top) / frameRect.height; // 0 bottom -> 1 top

            bars.forEach(bar => {
                const barRect = bar.getBoundingClientRect();
                const barCenterX = barRect.left + barRect.width / 2;
                const dist = Math.abs(e.clientX - barCenterX);
                const influence = Math.max(0, 1 - dist / influenceRadius);
                const baseHeight = 15;
                const targetHeight = baseHeight + (mouseHeightRatio * 90) * influence;
                bar.style.height = `${targetHeight}%`;
                bar.style.opacity = String(0.35 + influence * 0.65);
            });
        });

        document.addEventListener('mouseleave', () => {
            frame.classList.remove('interactive');
            bars.forEach(bar => { bar.style.height = ''; bar.style.opacity = ''; });
        });
    }

    initInteractiveBars(document.getElementById('site-footer-bars'));
    initInteractiveBars(document.querySelector('.hero-accent-bars'));

    // Service card image ring: tiles orbit the main photo on a tilted
    // ellipse hugging its right side. Position and z-index are computed
    // here from elapsed time rather than left to a CSS offset-path
    // animation, because a container-level transform (needed to tilt
    // the orbit) traps its children in their own stacking context —
    // no tile inside could ever get a z-index below the photo's, so it
    // could only ever be hidden, never genuinely appear behind it.
    // Setting each tile's z-index directly here instead lets the near
    // half of the loop paint above the photo (fully visible, in front)
    // and the far half paint below it (naturally clipped by the
    // photo's opaque edges — only whatever sticks out past them stays
    // visible), the way a planet's ring actually threads behind and in
    // front of the planet.
    const serviceRings = document.querySelectorAll('.service-img-ring');
    if (serviceRings.length) {
        const ORBIT_MS = 24000;
        const TILT = -25 * Math.PI / 180;

        const ringData = Array.from(serviceRings).map(ring => {
            const cardImg = ring.parentElement.querySelector(':scope > img');
            const tiles = Array.from(ring.querySelectorAll('.ring-img')).map(tile => ({
                el: tile,
                i: parseFloat(tile.style.getPropertyValue('--i')) || 0
            }));
            return { ring, cardImg, tiles, total: tiles.length || 1 };
        });

        // Promote the selected orbiting image to the main preview, and put
        // the previous main image back into that same position in the ring.
        ringData.forEach(({ cardImg, tiles }) => {
            if (!cardImg) return;

            tiles.forEach(({ el: tile }, index) => {
                tile.setAttribute('role', 'button');
                tile.setAttribute('tabindex', '0');
                tile.setAttribute('aria-label', `Show service image ${index + 1}`);

                const swapImages = () => {
                    const mainSrc = cardImg.getAttribute('src');
                    const tileSrc = tile.getAttribute('src');
                    if (!mainSrc || !tileSrc || mainSrc === tileSrc) return;

                    const imageAtWidth = (src, width) => {
                        const url = new URL(src, window.location.href);
                        url.searchParams.set('w', String(width));
                        return url.href;
                    };

                    cardImg.classList.remove('is-switching');
                    void cardImg.offsetWidth;
                    cardImg.classList.add('is-switching');
                    // Ring thumbnails are deliberately small. Request a
                    // full-size source before promoting one to the main image.
                    cardImg.setAttribute('src', imageAtWidth(tileSrc, 2074));
                    tile.setAttribute('src', imageAtWidth(mainSrc, 160));
                };

                tile.addEventListener('click', event => {
                    event.stopPropagation();
                    swapImages();
                });

                tile.addEventListener('keydown', event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        swapImages();
                    }
                });
            });
        });

        function updateServiceRings(time) {
            ringData.forEach(({ ring, cardImg, tiles, total }) => {
                const block = ring.closest('.service-block');
                if (!block || !cardImg || !block.matches(':hover')) return;
                const w = cardImg.offsetWidth;
                const h = cardImg.offsetHeight;
                const rx = w * 0.32;
                const ry = h * 0.68;
                const cx = w * 0.56;
                const cy = h * 0.5;
                tiles.forEach(({ el, i }) => {
                    const phase = ((time / ORBIT_MS) + i / total) % 1;
                    const angle = phase * Math.PI * 2;
                    const ex = Math.cos(angle) * rx;
                    const ey = Math.sin(angle) * ry;
                    const x = cx + ex * Math.cos(TILT) - ey * Math.sin(TILT);
                    const y = cy + ex * Math.sin(TILT) + ey * Math.cos(TILT);
                    el.style.transform = `translate(${x}px, ${y}px)`;
                    el.style.zIndex = ex > 0 ? 3 : 1;
                });
            });
            requestAnimationFrame(updateServiceRings);
        }
        requestAnimationFrame(updateServiceRings);
    }

    // Hero image ring uses the same elliptical rotation system as the
    // service-card thumbnails, but remains colourful and non-hoverable.
    const heroServiceOrbit = document.querySelector('.hero-service-orbit');
    if (heroServiceOrbit && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const heroOrbitTiles = Array.from(heroServiceOrbit.querySelectorAll('.hero-service-orbit-image'));
        const heroOrbitTotal = heroOrbitTiles.length || 1;
        const HERO_ORBIT_MS = 24000;
        const HERO_TILT = -25 * Math.PI / 180;

        const updateHeroServiceOrbit = time => {
            const width = heroServiceOrbit.offsetWidth;
            const height = heroServiceOrbit.offsetHeight;
            const radiusX = width * 0.36;
            const radiusY = height * 0.34;
            const centerX = width * 0.5;
            const centerY = height * 0.52;

            heroOrbitTiles.forEach((tile, index) => {
                const phase = ((time / HERO_ORBIT_MS) + index / heroOrbitTotal) % 1;
                const angle = phase * Math.PI * 2;
                const ellipseX = Math.cos(angle) * radiusX;
                const ellipseY = Math.sin(angle) * radiusY;
                const x = centerX + ellipseX * Math.cos(HERO_TILT) - ellipseY * Math.sin(HERO_TILT);
                const y = centerY + ellipseX * Math.sin(HERO_TILT) + ellipseY * Math.cos(HERO_TILT);
                tile.style.transform = `translate(${x}px, ${y}px)`;
                tile.style.zIndex = ellipseX > 0 ? '3' : '1';
            });

            requestAnimationFrame(updateHeroServiceOrbit);
        };

        requestAnimationFrame(updateHeroServiceOrbit);
    }

    // 8. Lucide Icons re-init
    if (typeof lucide !== 'undefined') lucide.createIcons();
});
