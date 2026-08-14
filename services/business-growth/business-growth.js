document.addEventListener('DOMContentLoaded', () => {
    const heading = document.querySelector('#growth-heading');
    const staticLine = heading?.querySelector('.hero-headline-static');
    const rotatingLine = heading?.querySelector('.hero-headline-rotating-line');

    const alignThroughWithTransforming = () => {
        if (!heading || !staticLine || !rotatingLine) return;
        const offset = Math.max(0, staticLine.getBoundingClientRect().left - heading.getBoundingClientRect().left) + 200;
        rotatingLine.style.setProperty('--growth-through-offset', `${offset}px`);
    };

    document.fonts?.ready.then(alignThroughWithTransforming);
    window.addEventListener('resize', alignThroughWithTransforming);
    alignThroughWithTransforming();

    const hero = document.querySelector('.growth-detail-hero');
    const trail = hero?.querySelector('.growth-image-trail');
    if (!hero || !trail || !window.matchMedia('(pointer: fine)').matches) return;

    let images = [
        '../../hero-brand-workshop.png',
        '../../hero-studio-team.png',
        '../../hero_team_photo.jpg',
        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=700&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=700&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=700&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=700&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=700&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=700&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=700&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=700&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=700&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=700&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=700&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=700&auto=format&fit=crop'
    ];
    let imageIndex = 0;
    let lastX = -100;
    let lastY = -100;

    hero.addEventListener('pointermove', event => {
        const bounds = hero.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        if (Math.hypot(x - lastX, y - lastY) < 72) return;
        lastX = x;
        lastY = y;

        if (imageIndex >= images.length) {
            const previousLast = images[images.length - 1];
            images = [...images].sort(() => Math.random() - .5);
            if (images[0] === previousLast) [images[0], images[1]] = [images[1], images[0]];
            imageIndex = 0;
        }
        const image = document.createElement('img');
        image.className = 'growth-trail-image';
        image.src = images[imageIndex];
        image.alt = '';
        imageIndex += 1;
        image.style.left = `${x}px`;
        image.style.top = `${y}px`;
        trail.appendChild(image);

        const rotation = imageIndex % 2 ? 5 : -5;
        image.animate([
            { opacity: 0, transform: `translate(-50%,-42%) scale(.72) rotate(${rotation}deg)` },
            { opacity: .78, offset: .18, transform: `translate(-50%,-50%) scale(1) rotate(${rotation}deg)` },
            { opacity: 0, transform: `translate(-50%,-70%) scale(.94) rotate(${rotation * 1.5}deg)` }
        ], { duration: 900, easing: 'cubic-bezier(.16,1,.3,1)' }).finished.finally(() => image.remove());
    }, { passive: true });
});

document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.growth-work-card'));
    if (!cards.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (!window.matchMedia('(min-width: 769px)').matches) return;

    const pairs = [[cards[0], cards[1]], [cards[2], cards[3]], [cards[4], cards[5]]];
    gsap.set(cards, { autoAlpha: 0 });
    gsap.set(pairs[0], { autoAlpha: 1, x: 0, yPercent: -50 });

    const dialTimeline = gsap.timeline({
        defaults: { duration: .7, ease: 'power2.inOut' },
        scrollTrigger: {
            trigger: '.growth-work-grid',
            start: 'top 16%',
            end: '+=220%',
            pin: true,
            scrub: .75,
            anticipatePin: 1,
            snap: { snapTo: .5, duration: { min: .2, max: .45 }, delay: .08, ease: 'power2.inOut' }
        }
    });

    dialTimeline.to('.growth-work-grid', { '--dial-y': '90%', duration: 2, ease: 'none' }, 0);

    for (let step = 1; step < pairs.length; step += 1) {
        const previous = pairs[step - 1];
        const next = pairs[step];
        const position = step - 1;
        const curveDistance = window.innerWidth * .16;

        dialTimeline
            .to(previous[0], {
                keyframes: [
                    { x: -curveDistance * .35, yPercent: -100, rotation: -4, autoAlpha: .7 },
                    { x: -curveDistance, yPercent: -170, rotation: -10, autoAlpha: 0 }
                ]
            }, position)
            .to(previous[1], {
                keyframes: [
                    { x: curveDistance * .35, yPercent: -100, rotation: 4, autoAlpha: .7 },
                    { x: curveDistance, yPercent: -170, rotation: 10, autoAlpha: 0 }
                ]
            }, position)
            .fromTo(next[0],
                { x: -curveDistance, yPercent: 70, rotation: 10, autoAlpha: 0 },
                { keyframes: [
                    { x: -curveDistance * .35, yPercent: 8, rotation: 4, autoAlpha: .75 },
                    { x: 0, yPercent: -50, rotation: 0, autoAlpha: 1 }
                ] },
                position + .12
            )
            .fromTo(next[1],
                { x: curveDistance, yPercent: 70, rotation: -10, autoAlpha: 0 },
                { keyframes: [
                    { x: curveDistance * .35, yPercent: 8, rotation: -4, autoAlpha: .75 },
                    { x: 0, yPercent: -50, rotation: 0, autoAlpha: 1 }
                ] },
                position + .12
            );
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const counters = Array.from(document.querySelectorAll('.growth-counter'));
    if (!counters.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const setFinalValue = counter => {
        counter.textContent = `${counter.dataset.target}${counter.dataset.suffix || ''}`;
    };

    if (reducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        counters.forEach(setFinalValue);
        return;
    }

    counters.forEach((counter, index) => {
        const target = Number(counter.dataset.target);
        const suffix = counter.dataset.suffix || '';
        const value = { current: 0 };
        const item = counter.closest('.stat-item');
        const label = item?.querySelector('p');

        gsap.set(counter, { yPercent: 110, autoAlpha: 0 });
        if (label) gsap.set(label, { y: 18, autoAlpha: 0 });

        ScrollTrigger.create({
            trigger: '.growth-stats',
            start: 'top 82%',
            once: true,
            onEnter: () => {
                const delay = index * .1;
                gsap.to(counter, { yPercent: 0, autoAlpha: 1, duration: .75, delay, ease: 'power3.out' });
                gsap.to(value, {
                    current: target,
                    duration: 1.6,
                    delay,
                    ease: 'power2.out',
                    onUpdate: () => { counter.textContent = `${Math.round(value.current)}${suffix}`; },
                    onComplete: () => setFinalValue(counter)
                });
                if (label) gsap.to(label, { y: 0, autoAlpha: 1, duration: .6, delay: delay + .3, ease: 'power3.out' });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.growth-work-carousel');
    const slides = Array.from(carousel?.querySelectorAll('.growth-work-slide') || []);
    if (!carousel || slides.length < 2) return;

    const title = carousel.querySelector('.growth-work-active-title');
    const category = carousel.querySelector('.growth-work-category');
    const description = carousel.querySelector('.growth-work-active-description');
    const previous = carousel.querySelector('.growth-work-prev');
    const next = carousel.querySelector('.growth-work-next');
    const progress = carousel.querySelector('.growth-work-progress');
    const stage = carousel.querySelector('.growth-work-stage');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeIndex = 0;
    let timer;
    let transitionToken = 0;
    let initialized = false;
    let isInView = false;

    if (progress && stage) stage.appendChild(progress);

    const restartTimer = () => {
        clearTimeout(timer);
        progress?.classList.remove('is-running');
        if (progress) void progress.offsetWidth;
        if (!reducedMotion && isInView) {
            progress?.classList.add('is-running');
            timer = window.setTimeout(() => show(activeIndex + 1, 1), 5500);
        }
    };

    const show = (requestedIndex) => {
        activeIndex = (requestedIndex + slides.length) % slides.length;
        slides.forEach(slide => slide.classList.remove('is-active', 'is-prev', 'is-next', 'is-far-prev', 'is-far-next', 'is-after', 'is-exiting'));
        slides[(activeIndex - 2 + slides.length) % slides.length].classList.add('is-far-prev');
        slides[(activeIndex - 1 + slides.length) % slides.length].classList.add('is-prev');
        slides[activeIndex].classList.add('is-active');
        slides[(activeIndex + 1) % slides.length].classList.add('is-next');
        slides[(activeIndex + 2) % slides.length].classList.add('is-far-next');

        const active = slides[activeIndex];
        const token = ++transitionToken;
        const textElements = [category, title, description];
        const updateText = () => {
            if (token !== transitionToken) return;
            category.textContent = active.dataset.category;
            title.textContent = active.dataset.title;
            description.textContent = active.dataset.description;
            if (!reducedMotion) {
                textElements.forEach((element, index) => {
                    element.animate([
                        { opacity: 0, transform: 'translateY(12px)', filter: 'blur(5px)' },
                        { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }
                    ], { duration: 430, delay: index * 65, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' });
                });
            }
        };
        if (!initialized || reducedMotion) {
            updateText();
            initialized = true;
        } else {
            textElements.forEach(element => element.animate([
                { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
                { opacity: 0, transform: 'translateY(-9px)', filter: 'blur(4px)' }
            ], { duration: 170, easing: 'ease-in', fill: 'forwards' }));
            window.setTimeout(updateText, 175);
        }
        restartTimer();
    };

    previous?.addEventListener('click', () => show(activeIndex - 1));
    next?.addEventListener('click', () => show(activeIndex + 1));
    carousel.addEventListener('mouseenter', () => {
        clearTimeout(timer);
        progress?.classList.remove('is-running');
    });
    carousel.addEventListener('mouseleave', restartTimer);
    carousel.addEventListener('focusin', () => clearTimeout(timer));
    carousel.addEventListener('focusout', restartTimer);
    show(0);

    const visibilityObserver = new IntersectionObserver(entries => {
        isInView = entries[0].isIntersecting;
        if (isInView) restartTimer();
        else {
            clearTimeout(timer);
            progress?.classList.remove('is-running');
        }
    }, { threshold: .35 });
    visibilityObserver.observe(carousel);
});

document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.growth-capabilities');
    const cards = Array.from(section?.querySelectorAll('.service-block') || []);
    if (!section || !cards.length) return;

    const previewSets = [
        ['reel-images/team-collaboration.jpg', 'reel-images/strategy-workshop.jpg'],
        ['reel-images/business-meeting.jpg', 'reel-images/growth-planning.jpg'],
        ['reel-images/modern-office.jpg', 'reel-images/creative-team.jpg'],
        ['reel-images/presentation.jpg', 'reel-images/planning-session.jpg']
    ];
    cards.forEach((card, index) => {
        const set = previewSets[index % previewSets.length];
        const fan = document.createElement('div');
        fan.className = 'growth-service-inline-fan';
        fan.setAttribute('aria-hidden', 'true');
        fan.innerHTML = `<img src="${set[0]}" alt=""><img src="${set[1]}" alt="">`;
        card.querySelector('.service-block-btns')?.before(fan);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const serviceWindows = Array.from(document.querySelectorAll('.growth-capabilities .service-block-img'));
    if (!serviceWindows.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    serviceWindows.forEach(windowFrame => {
        const image = windowFrame.querySelector('img');
        const reveal = gsap.timeline({
            scrollTrigger: {
                trigger: windowFrame,
                start: 'top 82%',
                toggleActions: 'play none none none'
            }
        });

        reveal.fromTo(windowFrame,
            { webkitMaskPosition: '0% 100%', maskPosition: '0% 100%' },
            { webkitMaskPosition: '0% 0%', maskPosition: '0% 0%', duration: 1, ease: 'power3.inOut' }
        );

        if (image) {
            reveal.fromTo(image,
                { yPercent: -10 },
                { yPercent: 0, duration: 1.15, ease: 'power3.out' },
                0
            );
        }
    });
});
