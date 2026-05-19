document.addEventListener('DOMContentLoaded', () => {
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
            btn.innerHTML = 'Enviando...';
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
