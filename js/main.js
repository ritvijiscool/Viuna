// Main JavaScript for Viuna Website
// Handles language switching, navigation, carousel, and interactions

// ===================================
// GLOBAL STATE
// ===================================
let currentLanguage = localStorage.getItem('viuna-language') || 'de';
let currentTestimonial = 0;

const testimonials = [
    { text: 'testimonial1_text', author: 'testimonial1_author' },
    { text: 'testimonial2_text', author: 'testimonial2_author' },
    { text: 'testimonial3_text', author: 'testimonial3_author' }
];

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage();
    initializeNavigation();
    initializeTestimonialCarousel();
    initializeImageCarousel(); // Add image gallery carousel
    initializeScrollEffects();
    loadHeroImage();
    loadMenuImages();
    loadAdminData(); // Load any changes made in admin panel
});

// ===================================
// LOAD ADMIN DATA
// ===================================
function loadAdminData() {
    // Load contact information
    const contactData = JSON.parse(localStorage.getItem('viuna-contact'));
    if (contactData) {
        // Update footer contact info
        const addressEl = document.querySelector('[data-translate="footer_address"]');
        const phoneEl = document.querySelector('[data-translate="footer_phone"]');
        const emailEl = document.querySelector('[data-translate="footer_email"]');
        const hoursWeekdayEl = document.querySelector('[data-translate="footer_hours_weekday"]');
        const hoursWeekendEl = document.querySelector('[data-translate="footer_hours_weekend"]');

        if (addressEl) addressEl.textContent = contactData.address;
        if (phoneEl) phoneEl.textContent = 'Tel: ' + contactData.phone;
        if (emailEl) emailEl.textContent = contactData.email;
        if (hoursWeekdayEl) hoursWeekdayEl.textContent = 'Mo-Fr: ' + contactData.hoursWeekday;
        if (hoursWeekendEl) hoursWeekendEl.textContent = 'Sa-So: ' + contactData.hoursWeekend;

        // Update social media links
        const instagramLink = document.querySelector('.social-link[aria-label="Instagram"]');
        const facebookLink = document.querySelector('.social-link[aria-label="Facebook"]');

        if (instagramLink && contactData.instagram) {
            instagramLink.href = contactData.instagram;
        }
        if (facebookLink && contactData.facebook) {
            facebookLink.href = contactData.facebook;
        }
    }

    // Load content data
    const contentData = JSON.parse(localStorage.getItem('viuna-content'));
    if (contentData) {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');

        if (heroTitle && contentData.heroTitleDE) {
            heroTitle.textContent = contentData.heroTitleDE;
        }
        if (heroSubtitle && contentData.heroSubtitleDE) {
            heroSubtitle.textContent = contentData.heroSubtitleDE;
        }
    }

    // Load menu items
    const menuItems = JSON.parse(localStorage.getItem('viuna-menu-items'));
    if (menuItems && menuItems.length > 0) {
        updateMenuDisplay(menuItems);
    }
}

function updateMenuDisplay(menuItems) {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    menuGrid.innerHTML = '';

    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
      <img src="images/menu-placeholder.jpg" alt="${item.name.de}" class="card-image" onerror="this.style.background='linear-gradient(135deg, #E8744F 0%, #C44536 100%)'; this.style.minHeight='250px';">
      <div class="card-content">
        <h3 class="card-title">${item.name[currentLanguage] || item.name.de}</h3>
        <p class="card-description">${item.description[currentLanguage] || item.description.de}</p>
        <p class="card-price">€${item.price.toFixed(2)}</p>
      </div>
    `;
        menuGrid.appendChild(card);
    });
}

// ===================================
// LANGUAGE SWITCHING
// ===================================
function initializeLanguage() {
    // Set initial language
    updateLanguage(currentLanguage);

    // Add event listeners to language buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            updateLanguage(lang);
        });
    });
}

function updateLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('viuna-language', lang);

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    // Update all translatable elements
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update testimonial
    updateTestimonial();
}

// ===================================
// NAVIGATION
// ===================================
function initializeNavigation() {
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });

    // Smooth scroll and active link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Close mobile menu
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');

                // Scroll to section
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===================================
// TESTIMONIAL CAROUSEL
// ===================================
function initializeTestimonialCarousel() {
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
            updateTestimonial();
        });

        nextBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            updateTestimonial();
        });
    }

    // Auto-rotate testimonials every 5 seconds
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        updateTestimonial();
    }, 5000);
}

function updateTestimonial() {
    const testimonialContent = document.getElementById('testimonialContent');
    if (!testimonialContent) return;

    const current = testimonials[currentTestimonial];
    const lang = currentLanguage;

    testimonialContent.innerHTML = `
    <p class="testimonial-text">"${translations[lang][current.text]}"</p>
    <p class="testimonial-author">${translations[lang][current.author]}</p>
  `;

    // Add fade animation
    testimonialContent.style.opacity = '0';
    setTimeout(() => {
        testimonialContent.style.opacity = '1';
    }, 50);
    testimonialContent.style.transition = 'opacity 0.5s ease-in-out';
}

// ===================================
// IMAGE GALLERY CAROUSEL
// ===================================
let currentSlide = 0;
const totalSlides = 5;

function initializeImageCarousel() {
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const indicators = document.querySelectorAll('.indicator');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            changeSlide(-1);
        });

        nextBtn.addEventListener('click', () => {
            changeSlide(1);
        });
    }

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // Auto-rotate every 4 seconds
    setInterval(() => {
        changeSlide(1);
    }, 4000);
}

function changeSlide(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');

    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentSlide) {
            slide.classList.add('active');
        }
    });

    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === currentSlide) {
            indicator.classList.add('active');
        }
    });
}

// ===================================
// SCROLL EFFECTS
// ===================================
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and features
    const animatedElements = document.querySelectorAll('.card, .feature-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ===================================
// IMAGE LOADING
// ===================================
function loadHeroImage() {
    const heroImage = document.getElementById('heroImage');
    if (heroImage) {
        // Try to load the generated hero image
        const generatedImagePath = '../.gemini/antigravity/brain/c305e574-3883-478b-8e1d-af285ff5e185/hero_cigkofte_wrap_1764599885270.png';

        // Check if image exists, otherwise use placeholder
        const img = new Image();
        img.onload = function () {
            heroImage.src = generatedImagePath;
        };
        img.onerror = function () {
            // Use a placeholder gradient if image not found
            heroImage.style.display = 'none';
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.background = 'linear-gradient(135deg, #2D8659 0%, #E8744F 100%)';
            }
        };
        img.src = generatedImagePath;
    }
}

function loadMenuImages() {
    // Set placeholder images for menu items
    const menuImages = [
        { selector: 'img[alt="Çiğ Köfte Dürüm"]', color: '#E8744F' },
        { selector: 'img[alt="Çiğ Köfte Teller"]', color: '#C44536' },
        { selector: 'img[alt="Vegan Mezze Platte"]', color: '#2D8659' },
        { selector: 'img[alt="Çiğ Köfte Box"]', color: '#D4654D' }
    ];

    menuImages.forEach(item => {
        const img = document.querySelector(item.selector);
        if (img) {
            // Create a gradient placeholder
            img.onerror = function () {
                img.style.background = `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`;
                img.style.minHeight = '250px';
            };
        }
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    };
    smoothScrollPolyfill();
}

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c🌱 Viuna - Come to Veggie', 'color: #2D8659; font-size: 24px; font-weight: bold;');
console.log('%cWebsite built with love and fresh ingredients! 🌿', 'color: #E8744F; font-size: 14px;');
