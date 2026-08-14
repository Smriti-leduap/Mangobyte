document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();

    const menuButton = document.getElementById('menu-toggle-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuLinks = menuOverlay ? menuOverlay.querySelectorAll('a') : [];

    const setMenuOpen = (open) => {
        if (!menuButton || !menuOverlay) return;
        menuButton.classList.toggle('open', open);
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        menuOverlay.classList.toggle('active', open);
        menuOverlay.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    if (menuButton && menuOverlay) {
        menuButton.addEventListener('click', () => {
            setMenuOpen(!menuOverlay.classList.contains('active'));
        });
        menuButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                menuButton.click();
            }
        });
        menuLinks.forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menuOverlay.classList.contains('active')) {
                setMenuOpen(false);
                menuButton.focus();
            }
        });
    }

    const goTopButton = document.querySelector('.home-go-top');
    if (goTopButton) {
        const updateGoTopButton = () => {
            goTopButton.classList.toggle('is-visible', window.scrollY > 240);
        };
        window.addEventListener('scroll', updateGoTopButton, { passive: true });
        goTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        updateGoTopButton();
    }
});
