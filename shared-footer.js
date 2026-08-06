class SiteFooter extends HTMLElement {
    connectedCallback() {
        const root = this.dataset.root || '';
        this.style.display = 'block';
        this.innerHTML = `
            <footer class="footer">
                <div class="container footer-shell">
                    <section class="footer-contact-surface">
                        <div class="footer-contact-content footer-reference-layout">
                            <div class="footer-reference-top">
                                <div class="footer-reference-intro">
                                    <p>From startups and law firms to e-Commerce and service businesses, we create digital solutions that increase visibility, generate leads, and drive growth.</p>
                                    <div class="footer-reference-social" aria-label="Social media links">
                                        <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.7 21v-8h2.7l.4-3.1h-3.1V7.92c0-.9.25-1.51 1.55-1.51H16.9V3.63a22.5 22.5 0 0 0-2.4-.12c-2.38 0-4 1.45-4 4.11V9.9H7.8V13h2.7v8h3.2Z"/></svg></a>
                                        <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="17.6" cy="6.5" r="1.2" fill="currentColor"/></svg></a>
                                        <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.65 3.5A1.85 1.85 0 1 0 4.65 7.2a1.85 1.85 0 0 0 0-3.7ZM3 8.7h3.3V21H3V8.7Zm5.4 0h3.16v1.68h.05c.44-.84 1.52-1.73 3.13-1.73 3.35 0 3.97 2.2 3.97 5.07V21h-3.3v-6.4c0-1.53-.03-3.5-2.13-3.5-2.14 0-2.47 1.67-2.47 3.39V21H8.4V8.7Z"/></svg></a>
                                    </div>
                                </div>
                                <nav class="footer-reference-column" aria-label="Quick links">
                                    <h4>Quick Links</h4>
                                    <a href="${root}index.html#home">Home</a>
                                    <a href="${root}index.html#services">Services</a>
                                    <a href="${root}index.html#about">About</a>
                                    <a href="${root}contact.html">Contact Us</a>
                                </nav>
                                <nav class="footer-reference-column" aria-label="Legal links">
                                    <h4>Legal</h4>
                                    <a href="#">Terms of Use</a>
                                    <a href="#">Privacy Policy</a>
                                </nav>
                            </div>
                            <div class="footer-reference-divider"></div>
                            <a class="footer-reference-logo" href="${root}index.html#home" aria-label="Mangobyte home"><img class="footer-logo-fallback" src="${root}footer-logo-white.svg" alt="Mangobyte"><video class="footer-logo-video" autoplay muted loop playsinline preload="auto" aria-hidden="true"><source src="${root}Corporate%20Video.mp4" type="video/mp4"></video><canvas class="footer-logo-canvas" aria-hidden="true"></canvas></a>
                            <div class="footer-reference-meta"><p>&copy; 2026 Mangobyte Digital. All rights reserved.</p></div>
                        </div>
                    </section>
                </div>
            </footer>`;
    }
}

customElements.define('site-footer', SiteFooter);
