document.addEventListener('DOMContentLoaded', () => {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.set('.case-study-heading', { xPercent: -50, yPercent: -50 });

    const finalGrid = () => {
        const stage = document.querySelector('.case-study-image-stage');
        const styles = getComputedStyle(stage);
        const insetLeft = parseFloat(styles.paddingLeft) || 0;
        const insetRight = parseFloat(styles.paddingRight) || 0;
        const innerWidth = stage.clientWidth - insetLeft - insetRight;
        const width = innerWidth * .14;
        const height = width / .89;
        const gap = Math.max(12, Math.min(24, innerWidth * .018));
        const top = stage.clientHeight * .28;
        return { width, gap, top, insetLeft, secondLeft: insetLeft + width + gap, secondTop: top + height + gap };
    };
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.case-study-scroll',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
            invalidateOnRefresh: true
        }
    });

    timeline
        .to('.case-study-heading', { top: '4%', left: () => `${finalGrid().insetLeft}px`, width: '42%', xPercent: 0, yPercent: 0, textAlign: 'left', duration: 1.2, ease: 'power1.inOut' }, 0)
        .to('.case-study-tags', { justifyContent: 'flex-start', duration: 1.2, ease: 'power1.inOut' }, 0)
        .to('.case-study-image-one', { top: () => `${finalGrid().top}px`, left: () => `${finalGrid().insetLeft}px`, right: 'auto', width: () => `${finalGrid().width}px`, duration: 1.2, ease: 'power1.inOut', force3D: true }, 0)
        .to('.case-study-image-two', { top: () => `${finalGrid().top}px`, left: () => `${finalGrid().secondLeft}px`, right: 'auto', width: () => `${finalGrid().width}px`, duration: 1.2, ease: 'power1.inOut', force3D: true }, 0)
        .to('.case-study-image-three', { top: () => `${finalGrid().secondTop}px`, left: () => `${finalGrid().insetLeft}px`, right: 'auto', width: () => `${finalGrid().width}px`, duration: 1.2, ease: 'power1.inOut', force3D: true }, 0)
        .to('.case-study-image-four', { top: () => `${finalGrid().secondTop}px`, left: () => `${finalGrid().secondLeft}px`, right: 'auto', width: () => `${finalGrid().width}px`, duration: 1.2, ease: 'power1.inOut', force3D: true }, 0)
        .to('.case-study-details', { top: () => `${finalGrid().top}px`, opacity: 1, y: 0, duration: .7, ease: 'power2.out' }, .5);

    const images = gsap.utils.toArray('.case-study-image');
    const restoreGrid = () => {
        const grid = finalGrid();
        const positions = [
            [grid.top, grid.insetLeft],
            [grid.top, grid.secondLeft],
            [grid.secondTop, grid.insetLeft],
            [grid.secondTop, grid.secondLeft]
        ];

        images.forEach((image, index) => {
            image.classList.remove('is-expanded');
            gsap.to(image, {
                top: positions[index][0],
                left: positions[index][1],
                width: grid.width,
                height: 'auto',
                aspectRatio: '.89',
                opacity: 1,
                scale: 1,
                zIndex: 1,
                pointerEvents: 'auto',
                duration: .55,
                ease: 'power3.inOut',
                overwrite: true
            });
        });
    };

    images.forEach(image => {
        image.addEventListener('pointerenter', () => {
            if (timeline.progress() < .82) return;
            const grid = finalGrid();
            const fullWidth = grid.width * 2 + grid.gap;
            const fullHeight = (grid.width / .89) * 2 + grid.gap;

            images.forEach(other => {
                if (other === image) return;
                gsap.to(other, { opacity: 0, scale: .94, pointerEvents: 'none', duration: .35, ease: 'power2.out', overwrite: true });
            });

            image.classList.add('is-expanded');
            gsap.to(image, {
                top: grid.top,
                left: grid.insetLeft,
                width: fullWidth,
                height: fullHeight,
                aspectRatio: 'auto',
                zIndex: 8,
                duration: .65,
                ease: 'power3.inOut',
                overwrite: true
            });
        });

        image.addEventListener('pointerleave', () => {
            if (!image.classList.contains('is-expanded')) return;
            restoreGrid();
        });
    });
});
