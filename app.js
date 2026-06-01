/**
 * Aplica un idioma a toda la página.
 * Reemplaza el texto de los elementos con data-i18n, los placeholders con
 * data-i18n-ph y el título del documento. Persiste la elección en localStorage.
 * @param {string} lang - Código de idioma ('es' | 'en' | 'de').
 */
function applyLanguage(lang) {
    const dict = (typeof translations !== 'undefined') ? translations[lang] : null;
    if (!dict) return;

    // Textos (textContent) y bloques con HTML embebido (data-i18n-html)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const value = dict[el.getAttribute('data-i18n')];
        if (value == null) return;
        if (el.hasAttribute('data-i18n-html')) {
            el.innerHTML = value;
        } else {
            el.textContent = value;
        }
    });

    // Placeholders de inputs
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const value = dict[el.getAttribute('data-i18n-ph')];
        if (value != null) el.setAttribute('placeholder', value);
    });

    // Metadatos del documento
    if (dict.doc_title) document.title = dict.doc_title;
    document.documentElement.lang = lang;

    // Estado activo del selector
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    try { localStorage.setItem('lang', lang); } catch (e) { /* almacenamiento no disponible */ }
}

document.addEventListener('DOMContentLoaded', () => {
    // Idioma: restaurar preferencia guardada (o español por defecto) y enlazar el selector
    const savedLang = (() => {
        try { return localStorage.getItem('lang'); } catch (e) { return null; }
    })();
    applyLanguage(savedLang && translations[savedLang] ? savedLang : 'es');

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')));
    });

    // Reveal animations on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply init styles to sections for reveal
    const sections = document.querySelectorAll('.section, .service-card, .portfolio-item, .pricing-card');
    sections.forEach(sec => {
        sec.style.opacity = '0';
        sec.style.transform = 'translateY(30px)';
        sec.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(sec);
    });

    // Form submission mock
    const form = document.getElementById('leadForm');
    const successMsg = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real scenario, you would send fetch/axios request here
            
            // Show loading state
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            const currentLang = document.documentElement.lang || 'es';
            const sendingText = (translations[currentLang] && translations[currentLang].form_sending) || 'Enviando...';
            btn.innerHTML = sendingText;
            btn.disabled = true;

            setTimeout(() => {
                form.classList.add('hidden');
                successMsg.classList.remove('hidden');
                
                // Animation for success
                successMsg.style.opacity = '0';
                successMsg.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    successMsg.style.transition = 'all 0.4s ease';
                    successMsg.style.opacity = '1';
                    successMsg.style.transform = 'scale(1)';
                }, 10);
            }, 800);
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 100;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = target.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
