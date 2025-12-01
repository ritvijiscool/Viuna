// Admin Panel JavaScript
// Handles authentication, menu management, gallery, and content editing

// ===================================
// AUTHENTICATION
// ===================================
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'viuna2024'
};

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('viuna-admin-auth') === 'true';
    if (isLoggedIn) {
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    loadDashboardData();
}

// Login form handler
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const alert = document.getElementById('loginAlert');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('viuna-admin-auth', 'true');
        showDashboard();
    } else {
        alert.textContent = 'Ungültige Anmeldedaten';
        alert.classList.remove('hidden');
    }
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('viuna-admin-auth');
    showLogin();
});

// ===================================
// NAVIGATION
// ===================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav-link[data-section]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.add('hidden'));

    const targetSection = document.getElementById(`section-${sectionName}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

// ===================================
// MENU MANAGEMENT
// ===================================
let menuItems = JSON.parse(localStorage.getItem('viuna-menu-items')) || [
    {
        id: 1,
        name: { de: 'Çiğ Köfte Dürüm', tr: 'Çiğ Köfte Dürüm', en: 'Çiğ Köfte Dürüm' },
        description: { de: 'Würziges Çiğ Köfte eingewickelt in frischem Lavash mit knackigem Salat, Minze und Zitrone', tr: 'Taze lavaşta baharatlı çiğ köfte, çıtır marul, nane ve limon ile', en: 'Spicy çiğ köfte wrapped in fresh lavash with crisp lettuce, mint, and lemon' },
        price: 5.50
    },
    {
        id: 2,
        name: { de: 'Çiğ Köfte Teller', tr: 'Çiğ Köfte Tabağı', en: 'Çiğ Köfte Plate' },
        description: { de: 'Serviert mit frischem Gemüse, Kräutern, Granatapfel und Zitrone', tr: 'Taze sebzeler, otlar, nar ve limon ile servis edilir', en: 'Served with fresh vegetables, herbs, pomegranate, and lemon' },
        price: 7.90
    },
    {
        id: 3,
        name: { de: 'Vegan Mezze Platte', tr: 'Vegan Meze Tabağı', en: 'Vegan Mezze Platter' },
        description: { de: 'Eine köstliche Auswahl an Çiğ Köfte, Hummus, Oliven und frischem Gemüse', tr: 'Çiğ köfte, humus, zeytin ve taze sebzelerden lezzetli bir seçki', en: 'A delicious selection of çiğ köfte, hummus, olives, and fresh vegetables' },
        price: 9.90
    },
    {
        id: 4,
        name: { de: 'Çiğ Köfte Box', tr: 'Çiğ Köfte Box', en: 'Çiğ Köfte Box' },
        description: { de: 'Perfekt zum Mitnehmen – frisches Çiğ Köfte mit allen Beilagen', tr: 'Paket servise mükemmel – tüm garnitürlerle taze çiğ köfte', en: 'Perfect for takeaway – fresh çiğ köfte with all the trimmings' },
        price: 6.50
    }
];

function loadMenuItems() {
    const tbody = document.getElementById('menuTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    menuItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${item.name.de}</td>
      <td>€${item.price.toFixed(2)}</td>
      <td class="table-actions">
        <button class="btn btn-sm btn-outline" onclick="editMenuItem(${item.id})">Bearbeiten</button>
        <button class="btn btn-sm btn-danger" onclick="deleteMenuItem(${item.id})">Löschen</button>
      </td>
    `;
        tbody.appendChild(row);
    });

    updateMenuCount();
}

function updateMenuCount() {
    const countEl = document.getElementById('menuCount');
    if (countEl) {
        countEl.textContent = menuItems.length;
    }
}

function saveMenuItems() {
    localStorage.setItem('viuna-menu-items', JSON.stringify(menuItems));
}

function addMenuItem(itemData) {
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1;
    menuItems.push({ id: newId, ...itemData });
    saveMenuItems();
    loadMenuItems();
    showAlert('menuAlert', 'Menü Item erfolgreich hinzugefügt!');
}

function editMenuItem(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    // Populate form with item data
    document.getElementById('itemNameDE').value = item.name.de;
    document.getElementById('itemNameTR').value = item.name.tr;
    document.getElementById('itemNameEN').value = item.name.en;
    document.getElementById('itemDescDE').value = item.description.de;
    document.getElementById('itemPrice').value = item.price;

    // Show modal (simplified - in production use proper modal)
    alert('Bearbeiten-Funktion: In der Vollversion würde hier ein Modal erscheinen.');
}

function deleteMenuItem(id) {
    if (confirm('Möchten Sie dieses Item wirklich löschen?')) {
        menuItems = menuItems.filter(i => i.id !== id);
        saveMenuItems();
        loadMenuItems();
        showAlert('menuAlert', 'Menü Item erfolgreich gelöscht!');
    }
}

// ===================================
// GALLERY MANAGEMENT
// ===================================
let galleryImages = JSON.parse(localStorage.getItem('viuna-gallery')) || [];

function loadGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (galleryImages.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-gray);">Noch keine Bilder hochgeladen</p>';
    } else {
        galleryImages.forEach((img, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
        <img src="${img.data}" alt="${img.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: var(--spacing-sm);">
        <p style="font-size: 0.875rem; margin-bottom: var(--spacing-sm);">${img.name}</p>
        <button class="btn btn-sm btn-danger" onclick="deleteImage(${index})">Löschen</button>
      `;
            grid.appendChild(card);
        });
    }

    updateGalleryCount();
}

function updateGalleryCount() {
    const countEl = document.getElementById('galleryCount');
    if (countEl) {
        countEl.textContent = galleryImages.length;
    }
}

function saveGallery() {
    localStorage.setItem('viuna-gallery', JSON.stringify(galleryImages));
}

function deleteImage(index) {
    if (confirm('Möchten Sie dieses Bild wirklich löschen?')) {
        galleryImages.splice(index, 1);
        saveGallery();
        loadGallery();
    }
}

// Image upload
document.getElementById('imageUpload')?.addEventListener('click', () => {
    document.getElementById('imageInput').click();
});

document.getElementById('imageInput')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        galleryImages.push({
            name: file.name,
            data: event.target.result
        });
        saveGallery();
        loadGallery();
    };
    reader.readAsDataURL(file);
});

// ===================================
// CONTENT MANAGEMENT
// ===================================
document.getElementById('contentForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const contentData = {
        heroTitleDE: document.getElementById('heroTitleDE').value,
        heroSubtitleDE: document.getElementById('heroSubtitleDE').value,
        aboutTextDE: document.getElementById('aboutTextDE').value
    };

    localStorage.setItem('viuna-content', JSON.stringify(contentData));
    showAlert('contentAlert', 'Inhalte erfolgreich gespeichert!');
});

// ===================================
// CONTACT MANAGEMENT
// ===================================
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const contactData = {
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        instagram: document.getElementById('instagram').value,
        facebook: document.getElementById('facebook').value,
        hoursWeekday: document.getElementById('hoursWeekday').value,
        hoursWeekend: document.getElementById('hoursWeekend').value
    };

    localStorage.setItem('viuna-contact', JSON.stringify(contactData));
    showAlert('contactAlert', 'Kontaktdaten erfolgreich gespeichert!');
});

// ===================================
// UTILITIES
// ===================================
function showAlert(alertId, message) {
    const alert = document.getElementById(alertId);
    if (alert) {
        alert.textContent = message;
        alert.classList.remove('hidden');
        setTimeout(() => {
            alert.classList.add('hidden');
        }, 3000);
    }
}

function loadDashboardData() {
    loadMenuItems();
    loadGallery();
    updateMenuCount();
    updateGalleryCount();
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initNavigation();
});
