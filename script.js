/**
 * Galaxy Car Decors Website - JavaScript
 * Optimized for Performance & User Experience
 */

'use strict';

// =====================================================
// MOBILE MENU TOGGLE
// =====================================================

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
    });

    // Close menu when a link is clicked
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
        }
    });
}

// =====================================================
// FOOTER YEAR AUTO-UPDATE
// =====================================================

const yearElement = document.getElementById('year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// =====================================================
// SMOOTH SCROLL BEHAVIOR
// =====================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const headerOffset = 75;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =====================================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// =====================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .gallery-item, .review-card, .trust-item, .why-card, .location-info, .map-container').forEach(el => {
    observer.observe(el);
});

// =====================================================
// LAZY LOADING IMAGES (Performance)
// =====================================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
} else {
    // Fallback for browsers without IntersectionObserver
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
    });
}

// =====================================================
// ACTIVE NAV LINK TRACKING
// =====================================================

window.addEventListener('scroll', () => {
    let current = '';

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// =====================================================
// HEADER SCROLL EFFECT
// =====================================================

let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        header.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// =====================================================
// COUNTER ANIMATION (Optional - for stats)
// =====================================================

function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observer for counter animations
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = parseInt(entry.target.getAttribute('data-target')) || 0;
            animateCounter(entry.target, target);
            entry.target.classList.add('counted');
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(counter => {
    counterObserver.observe(counter);
});

// =====================================================
// FORM VALIDATION (If needed)
// =====================================================

const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        let isValid = true;

        form.querySelectorAll('input[required], textarea[required]').forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                field.setAttribute('aria-invalid', 'true');
            } else {
                field.classList.remove('error');
                field.setAttribute('aria-invalid', 'false');
            }
        });

        if (!isValid) {
            e.preventDefault();
        }
    });
});

// =====================================================
// ACCESSIBILITY: KEYBOARD NAVIGATION
// =====================================================

document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape' && nav) {
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
    }
});

// =====================================================
// PERFORMANCE: REQUEST ANIMATION FRAME FOR SCROLL
// =====================================================

let ticking = false;

function updateScrolledElements() {
    document.querySelectorAll('[data-scroll]').forEach(el => {
        const rect = el.getBoundingClientRect();
        const scrollPercent = 1 - (rect.top / window.innerHeight);
        el.style.setProperty('--scroll-percent', Math.max(0, Math.min(1, scrollPercent)));
    });
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateScrolledElements);
        ticking = true;
    }
}, { passive: true });

// =====================================================
// NETWORK STATUS DETECTION
// =====================================================

window.addEventListener('online', () => {
    console.log('Connection restored');
    document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    document.body.classList.add('offline');
});

// =====================================================
// ANALYTICS & TRACKING (Optional)
// =====================================================

// Track button clicks
document.querySelectorAll('a[href^="tel:"], a[href^="https://wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
        const action = link.href.includes('tel') ? 'call' : 'whatsapp';
        console.log(`User clicked: ${action}`);
    });
});

// =====================================================
// PERFORMANCE MONITORING
// =====================================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
    });
}

// =====================================================
// SERVICE WORKER REGISTRATION (Optional - for PWA)
// =====================================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('ServiceWorker registration failed: ', err);
    });
}

// =====================================================
// DYNAMIC CONTENT LOADING SIMULATION
// =====================================================

async function fetchDynamicContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching content:', error);
        return null;
    }
}

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    // Add 'loaded' class to body
    document.body.classList.add('loaded');

    // Initialize animations
    initializeAnimations();
});

function initializeAnimations() {
    // Trigger initial animations for hero section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('in-view');
    }

    // Stagger animation for service cards
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// =====================================================
// RESPONSIVE IMAGE LOADING
// =====================================================

function handleResponsiveImages() {
    const images = document.querySelectorAll('img[data-src-mobile], img[data-src-desktop]');
    const isMobile = window.innerWidth < 768;

    images.forEach(img => {
        const srcAttr = isMobile ? 'data-src-mobile' : 'data-src-desktop';
        const src = img.getAttribute(srcAttr);
        if (src && !img.src.includes(src)) {
            img.src = src;
        }
    });
}

window.addEventListener('resize', () => {
    handleResponsiveImages();
});

handleResponsiveImages();

// =====================================================
// THEME DETECTION (Optional - Dark/Light Mode)
// =====================================================

function detectTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.body.classList.add('dark-theme');
    }
}

// detectTheme(); // Uncomment to enable

// =====================================================
// CONSOLE GREETING
// =====================================================

console.log(
    '%c🚗 Welcome to Galaxy Car Decors! 🚗',
    'color: #e63946; font-size: 20px; font-weight: bold;'
);
console.log(
    '%cHave a question? Call us at +91 8686448702 or WhatsApp us!',
    'color: #25D366; font-size: 14px;'
);


/* =========================================
   WHATSAPP ENQUIRY FORM
========================================= */

const whatsappForm = document.getElementById("whatsappForm");

whatsappForm.addEventListener("submit", function (event) {

    // Prevent normal form submission
    event.preventDefault();


    // Get form values
    const name =
        document.getElementById("name").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const car =
        document.getElementById("car").value.trim();

    const service =
        document.getElementById("service").value;

    const message =
        document.getElementById("message").value.trim();


    // =========================================
    // CLIENT'S WHATSAPP NUMBER
    // =========================================

    // Replace this with Galaxy Car Decors' WhatsApp number.
    // IMPORTANT:
    // Use country code WITHOUT + or spaces.
    
    const whatsappNumber = "917093218069";


    // =========================================
    // CREATE WHATSAPP MESSAGE
    // =========================================

    // Only customer information
            const whatsappMessage =
        `Name: ${name}
            Phone: ${phone}
            Car: ${car}
            Service: ${service}
            Message: ${message || "No message"}`;


    const encodedMessage =
        encodeURIComponent(whatsappMessage);


    const whatsappURL =
        `https://wa.me/${7093218069}?text=${encodedMessage}`;


    window.open(
        whatsappURL,
        "_blank"
    );

    });