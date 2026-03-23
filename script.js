const menuBtn = document.getElementById('menu-btn');
const menuLinks = document.getElementById('menu-links');
const spans = menuBtn.querySelectorAll('span');

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

menuBtn.addEventListener('click', () => {
    // Affiche/Masque le menu
    menuLinks.classList.toggle('hidden');
    menuLinks.classList.toggle('flex');

    // Animation du hamburger en croix
    spans[0].classList.toggle('rotate-45');
    spans[0].classList.toggle('translate-y-[1px]');
    spans[1].classList.toggle('opacity-0');
    spans[2].classList.toggle('-rotate-45');
    spans[2].classList.toggle('-translate-y-[1px]');
});


//galerie slider
let currentGalleryImages = [];
let currentImageIndex = 0;
let allImages = [];

document.addEventListener('DOMContentLoaded', () => {
    // On récupère toutes les sources d'images de la galerie
    const galleryItems = document.querySelectorAll('.group');
    allImages = Array.from(document.querySelectorAll('.group img')).map(img => img.src);

    galleryItems.forEach((item, index) => {
        item.style.cursor = 'zoom-in';
        item.onclick = function (e) {
            e.preventDefault();
            currentImageIndex = index;
            openLightbox(allImages[currentImageIndex]);
        };
    });
});

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    
    currentImageIndex = index;
    img.src = currentGalleryImages[currentImageIndex];
    
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;

    if (currentImageIndex >= currentGalleryImages.length) currentImageIndex = 0;
    if (currentImageIndex < 0) currentImageIndex = currentGalleryImages.length - 1;

    const img = document.getElementById('lightbox-img');
    // Petit effet de fondu lors du changement
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = currentGalleryImages[currentImageIndex];
        img.style.opacity = '1';
    }, 150);
}

function handleOutsideClick(e) {
    if (e.target.id === 'lightbox') closeLightbox();
}

// Navigation au clavier (Flèches et Echap)
document.addEventListener('keydown', (e) => {
    if (document.getElementById('lightbox').classList.contains('hidden')) return;

    if (e.key === "ArrowRight") changeImage(1);
    if (e.key === "ArrowLeft") changeImage(-1);
    if (e.key === "Escape") closeLightbox();
});


//setting gallerie

/**
 * Génère une galerie de manière dynamique
 * @param {string} containerId - L'ID du div HTML
 * @param {Array} data - Le tableau d'objets images
 * @param {string} folder - Le dossier source (ex: 'images/cadrans/')
 */
function generateGallery(containerId, data, folder) {
    const container = document.getElementById(containerId);
    if (!container) return;

    currentGalleryImages = data.map(item => folder + item.src);

    container.innerHTML = data.map((item, index) => {
        return `
            <div class="group relative overflow-hidden rounded-[2rem] shadow-xl bg-slate-50 border border-slate-100 transition-all duration-500">
                <div class="aspect-square overflow-hidden">
                    <img src="${folder}${item.src}" alt="${item.alt}" 
                        class="w-full h-full object-cover transition duration-700 group-hover:scale-110 cursor-zoom-in"
                        onclick="openLightbox(${index})"> </div>
                
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 pointer-events-none">
                    <h4 class="text-white font-serif italic text-lg">${item.title}</h4>
                    <p class="text-orange-400 text-[10px] uppercase tracking-widest mt-1">${item.desc}</p>
                </div>
            </div>
        `;
    }).join('');
}

// --- CONFIGURATION DES DONNÉES PAR PAGE ---

// 1. Pour la page CADRANS
const dataCadrans = [
    { src: 'gal-1.jpg', title: 'Cadran de type Blason', desc: 'Enduit à la chaux & pigments', alt: 'Cadran blason' },
    { src: 'gal-2.jpg', title: 'Composition Octogonale', desc: 'Décor floral & Devise', alt: 'Cadran octogonal' },
    { src: 'gal-3.jpg', title: 'Précision Gnomonique', desc: 'Heures italiennes', alt: 'Détail technique' },
    { src: 'gal-4.jpg', title: 'Épure Minérale', desc: 'Lignes équinoxiales', alt: 'Cadran moderne' },
    { src: 'gal-5.jpg', title: 'Cadran Circulaire', desc: 'Fresque monumentale', alt: 'Grand cadran' },
    { src: 'gal-6.jpg', title: 'Symbolique & Courbes', desc: 'Signes zodiacaux', alt: 'Zodiaque' },
    { src: 'gal-7.jpg', title: 'Format Panoramique', desc: 'Intégration architecturale', alt: 'Panoramique', large: true },
    { src: 'gal-8.jpg', title: 'Format Panoramique', desc: 'Intégration architecturale', alt: 'Panoramique', large: true },
    { src: 'gal-9.jpg', title: 'Format Panoramique', desc: 'Intégration architecturale', alt: 'Panoramique', large: true },
    { src: 'gal-10.jpg', title: 'Format Panoramique', desc: 'Intégration architecturale', alt: 'Panoramique', large: true },
    { src: 'gal-11.jpg', title: 'Format Panoramique', desc: 'Intégration architecturale', alt: 'Panoramique', large: true },
    { src: 'gal-12.jpg', title: 'Format Panoramique', desc: 'Intégration architecturale', alt: 'Panoramique', large: true },
    { src: 'gal-13.jpg', title: 'Format Panoramique', desc: 'Intégration architecturale', alt: 'Panoramique', large: true },
    { src: 'gal-14.jpg', title: 'Format Panoramique', desc: 'Intégration architecturale', alt: 'Panoramique', large: true },
    { src: 'gal-15.jpg', title: 'Format Panoramique', desc: 'Intégration architecturale', alt: 'Panoramique', large: true }
];

// 2. Pour la page VITRAUX (Exemple)
const dataVitraux = [
    { 
        src: 'gal-1.jpg', 
        title: 'Éclat de Lumière', 
        desc: 'Verre soufflé & Sertissage traditionnel au plomb', 
        alt: 'Détail d un vitrail artisanal avec des jeux de textures et de transparence' 
    },
    { 
        src: 'gal-2.jpg', 
        title: 'Composition Géométrique', 
        desc: 'Harmonie de couleurs et contrastes', 
        alt: 'Vitrail aux motifs géométriques modernes utilisant des verres teintés dans la masse' 
    },
    { 
        src: 'gal-3.jpg', 
        title: 'Le Geste du Verrier', 
        desc: 'Découpe de précision & Calibrage', 
        alt: 'Gros plan sur la main de l artisan découpant une pièce de verre colorée' 
    },
    { 
        src: 'gal-4.jpg', 
        title: 'Restauration Patrimoine', 
        desc: 'Nettoyage et remise en plomb d\'une pièce ancienne', 
        alt: 'Restauration d un vitrail d église ancien respectant les techniques d origine' 
    },
    { 
        src: 'gal-5.jpg', 
        title: 'Jardin de Verre', 
        desc: 'Motifs floraux & Peinture sur verre (Grisaille)', 
        alt: 'Vitrail décoratif représentant des fleurs avec des détails peints à la main' 
    },
    { 
        src: 'gal-6.jpg', 
        title: 'Lumière Sacrée', 
        desc: 'Étanchéité et mise en mastic traditionnelle', 
        alt: 'Vitrail de style gothique filtrant la lumière du soleil dans un édifice' 
    },
    { 
        src: 'gal-7.jpg', 
        title: 'Format Panoramique', 
        desc: 'Impression colorée pour espace architectural', 
        alt: 'Grande imposte en vitrail de format allongé pour une décoration intérieure' 
    },
    { 
        src: 'gal-8.jpg', 
        title: 'L\'Art du Trait', 
        desc: 'Maquette et tracé à l\'échelle réelle (le Chemin)', 
        alt: 'Dessin préparatoire et calque pour la réalisation d un nouveau vitrail' 
    },
    { 
        src: 'gal-9.jpg', 
        title: 'Transparence Indigo', 
        desc: 'Jeu de nuances dans les bleus antiques', 
        alt: 'Détail de verres bleus et bullés assemblés par des baguettes de plomb' 
    },
    { 
        src: 'gal-10.jpg', 
        title: 'Soudure à l\'Étain', 
        desc: 'Finitions et solidité de l\'assemblage', 
        alt: 'Gros plan sur les points de soudure à l étain reliant les plombs du vitrail' 
    }
];


const dataFormations = [
    { 
        src: 'gal-1.jpg', 
        title: 'Transmission du Savoir', 
        desc: 'Échanges et conseils personnalisés en atelier', 
        alt: 'Didier Cottier expliquant les techniques de gnomonique à un stagiaire' 
    },
    { 
        src: 'gal-2.jpg', 
        title: 'L\'Art du Tracé', 
        desc: 'Apprentissage des lignes horaires et solsticiales', 
        alt: 'Élève en formation traçant les courbes d un cadran solaire sur papier' 
    },
    { 
        src: 'gal-3.jpg', 
        title: 'Initiation au Vitrail', 
        desc: 'Découverte de la coupe du verre et du calibrage', 
        alt: 'Stagiaire apprenant à couper du verre coloré pour un projet de vitrail' 
    },
    { 
        src: 'gal-4.jpg', 
        title: 'Précision du Geste', 
        desc: 'Maîtriser les outils traditionnels de l\'artisan', 
        alt: 'Main d un élève utilisant un outil de précision sur une pièce de verre' 
    },
    { 
        src: 'gal-5.jpg', 
        title: 'Atelier de Création', 
        desc: 'Un espace dédié à l\'apprentissage et au partage', 
        alt: 'Vue d ensemble de l atelier Ombre Jaille pendant une session de formation' 
    },
    { 
        src: 'gal-6.jpg', 
        title: 'Sertissage au Plomb', 
        desc: 'Apprendre l\'assemblage ancestral des vitraux', 
        alt: 'Mise en plomb d un petit panneau décoratif par un élève en stage' 
    },
    { 
        src: 'gal-7.jpg', 
        title: 'Étude Gnomonique', 
        desc: 'Comprendre la course du soleil et le temps vrai', 
        alt: 'Cours théorique sur le fonctionnement des cadrans solaires en extérieur' 
    },
    { 
        src: 'gal-8.jpg', 
        title: 'Soudure et Finitions', 
        desc: 'Le plaisir de voir son œuvre prendre forme', 
        alt: 'Élève réalisant ses premières soudures à l étain sur un vitrail' 
    },
    { 
        src: 'gal-9.jpg', 
        title: 'Peinture sur Verre', 
        desc: 'Initiation à la grisaille et aux émaux', 
        alt: 'Détail d un travail de peinture délicat réalisé par un stagiaire' 
    },
    { 
        src: 'gal-10.jpg', 
        title: 'Fierté de l\'Artisan', 
        desc: 'Repartir avec sa propre création réalisée en stage', 
        alt: 'Stagiaire présentant son cadran solaire terminé à la fin de la formation' 
    },
    { 
        src: 'gal-11.jpg', 
        title: 'Soudure à l\'Étain', 
        desc: 'Finitions et solidité de l\'assemblage', 
        alt: 'Gros plan sur les points de soudure à l étain reliant les plombs du vitrail' 
    },
    { 
        src: 'gal-12.jpg', 
        title: 'Soudure à l\'Étain', 
        desc: 'Finitions et solidité de l\'assemblage', 
        alt: 'Gros plan sur les points de soudure à l étain reliant les plombs du vitrail' 
    }
];

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    generateGallery('gallery-cadrans', dataCadrans, 'images/cadrans/');
    generateGallery('gallery-vitraux', dataVitraux, 'images/vitraux/');
    generateGallery('gallery-formations', dataFormations, 'images/formations/');
});