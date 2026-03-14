window.addEventListener('load', () => {
    updateScrollEffects(); // Premier calcul précis une fois les images chargées
});

// === FONCTION DE MISE À JOUR DYNAMIQUE ===
function updateScrollEffects() {
    const nav = document.getElementById('main-nav');
    const logo = document.getElementById('nav-logo');
    const scrollLine = document.getElementById('scroll-line');
    const scrollDot = document.getElementById('scroll-dot');
    const atelier = document.getElementById('atelier');
    const creations = document.getElementById('creations');

    // Vérification de sécurité (Correction ici : on utilise 'atelier')
    if (!nav || !atelier) return;

    // --- 1. GESTION DE LA NAVIGATION (Couleur et Glass) ---
    const sectionTop = atelier.getBoundingClientRect().top;

    if (sectionTop > 80) {
        nav.classList.add('glass', 'text-white', 'py-4');
        nav.classList.remove('bg-slate-900/90', 'shadow-2xl', 'py-2');
    } else {
        nav.classList.remove('glass', 'py-4');
        nav.classList.add('bg-slate-900/90', 'text-white', 'shadow-2xl', 'py-2');
    }

    if (atelier && creations) {
        // .getBoundingClientRect().top + window.scrollY est plus fiable que offsetTop
        const zoneStart = atelier.getBoundingClientRect().top + window.scrollY;
        const zoneEnd = creations.getBoundingClientRect().top + window.scrollY + creations.offsetHeight;
        const zoneHeight = zoneEnd - zoneStart;

        const scrollPos = window.scrollY + (window.innerHeight / 2);

        // FORCE LE 0 si on est au-dessus
        let progress = 0;
        if (scrollPos > zoneStart) {
            progress = ((scrollPos - zoneStart) / zoneHeight) * 100;
        }

        const finalProgress = Math.min(Math.max(progress, 0), 100);
        
        if (scrollLine) scrollLine.style.height = `${finalProgress}%`;
        if (scrollDot) {
            scrollDot.style.top = `${finalProgress}%`;
            
            if (finalProgress > 0) {
                scrollDot.style.opacity = "1";
            } else {
                scrollDot.style.opacity = "0";
            }
        }
    }
}

// Lancer au scroll et au chargement
window.addEventListener('scroll', updateScrollEffects);
window.addEventListener('load', updateScrollEffects);

// Lancer IMMÉDIATEMENT au chargement pour éviter l'état "rempli" par erreur
window.addEventListener('DOMContentLoaded', updateScrollEffects);

// === ANIMATION DES ITEMS BENTO ===
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('.bento-item').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "all 0.6s ease-out";
    observer.observe(el);
});
