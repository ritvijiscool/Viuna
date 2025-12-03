// Admin Panel JavaScript
// Handles authentication, menu management, and content editing

// ===================================
// AUTHENTICATION
// ===================================
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'viuna2024'
};

// ===================================
// DATABASE API HELPERS
// ===================================
async function loadContentFromDB(slug) {
    try {
        const response = await fetch(`/api/get-content?slug=${slug}`);

        if (response.status === 404) {
            // Content doesn't exist yet, return null
            return null;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error(`Error loading content for ${slug}:`, error);
        return null;
    }
}

async function saveContentToDB(slug, content) {
    try {
        const response = await fetch('/api/update-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ slug, content })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error saving content for ${slug}:`, error);
        throw error;
    }
}

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
        price: 5.50,
        image: null
    },
    // ... other items
];

// Handle Menu Image Upload
let currentMenuImage = null;
document.getElementById('itemImage')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentMenuImage = event.target.result;
            const preview = document.getElementById('imagePreview');
            preview.style.display = 'block';
            preview.querySelector('img').src = currentMenuImage;
        };
        reader.readAsDataURL(file);
    }
});

async function loadMenuItems() {
    const tbody = document.getElementById('menuTableBody');
    if (!tbody) return;

    // Try to load from database first
    const dbMenuItems = await loadContentFromDB('menu-items');

    if (dbMenuItems && Array.isArray(dbMenuItems)) {
        menuItems = dbMenuItems;
    } else if (!menuItems || menuItems.length === 0) {
        // Use default menu items if nothing in database
        menuItems = [
            {
                id: 1,
                name: { de: 'Çiğ Köfte Dürüm', tr: 'Çiğ Köfte Dürüm', en: 'Çiğ Köfte Dürüm' },
                description: {
                    de: 'Würziges Çiğ Köfte eingewickelt in frischem Lavash mit knackigem Salat, Minze und Zitrone',
                    tr: 'Taze lavaşta baharatlı çiğ köfte, çıtır marul, nane ve limon ile',
                    en: 'Spicy çiğ köfte wrapped in fresh lavash with crisp lettuce, mint, and lemon'
                },
                price: 5.50,
                image: null
            },
            {
                id: 2,
                name: { de: 'Çiğ Köfte Teller', tr: 'Çiğ Köfte Tabağı', en: 'Çiğ Köfte Plate' },
                description: {
                    de: 'Serviert mit frischem Gemüse, Kräutern, Granatapfel und Zitrone',
                    tr: 'Taze sebzeler, otlar, nar ve limon ile servis edilir',
                    en: 'Served with fresh vegetables, herbs, pomegranate, and lemon'
                },
                price: 7.90,
                image: null
            },
            {
                id: 3,
                name: { de: 'Vegan Mezze Platte', tr: 'Vegan Meze Tabağı', en: 'Vegan Mezze Platter' },
                description: {
                    de: 'Eine köstliche Auswahl an Çiğ Köfte, Hummus, Oliven und frischem Gemüse',
                    tr: 'Çiğ köfte, humus, zeytin ve taze sebzelerden lezzetli bir seçki',
                    en: 'A delicious selection of çiğ köfte, hummus, olives, and fresh vegetables'
                },
                price: 9.90,
                image: null
            },
            {
                id: 4,
                name: { de: 'Çiğ Köfte Box', tr: 'Çiğ Köfte Box', en: 'Çiğ Köfte Box' },
                description: {
                    de: 'Perfekt zum Mitnehmen – frisches Çiğ Köfte mit allen Beilagen',
                    tr: 'Paket servise mükemmel – tüm garnitürlerle taze çiğ köfte',
                    en: 'Perfect for takeaway – fresh çiğ köfte with all the trimmings'
                },
                price: 6.50,
                image: null
            }
        ];
    }

    tbody.innerHTML = '';

    menuItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>
        <div style="display: flex; align-items: center; gap: 10px;">
            ${item.image ? `<img src="${item.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">` : ''}
            ${item.name.de}
        </div>
      </td>
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

async function saveMenuItems() {
    try {
        await saveContentToDB('menu-items', menuItems);
        return true;
    } catch (error) {
        console.error('Error saving menu items:', error);
        showAlert('menuAlert', 'Fehler beim Speichern!');
        return false;
    }
}

// Update addMenuItem/editMenuItem logic to handle image
let currentEditingId = null;

// Add Item Button
document.getElementById('addMenuItemBtn')?.addEventListener('click', () => {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Menü Item Hinzufügen';
    document.getElementById('menuItemForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    currentMenuImage = null;
    document.getElementById('menuModal').classList.remove('hidden');
});

// Cancel Modal
document.getElementById('cancelModal')?.addEventListener('click', () => {
    document.getElementById('menuModal').classList.add('hidden');
});

// Edit Item
function editMenuItem(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    currentEditingId = id;
    document.getElementById('modalTitle').textContent = 'Menü Item Bearbeiten';

    // Populate form
    document.getElementById('itemNameDE').value = item.name.de;
    document.getElementById('itemNameTR').value = item.name.tr;
    document.getElementById('itemNameEN').value = item.name.en;
    document.getElementById('itemDescDE').value = item.description.de;
    document.getElementById('itemPrice').value = item.price;

    // Show image preview if exists
    if (item.image) {
        currentMenuImage = item.image;
        const preview = document.getElementById('imagePreview');
        preview.style.display = 'block';
        preview.querySelector('img').src = item.image;
    } else {
        currentMenuImage = null;
        document.getElementById('imagePreview').style.display = 'none';
    }

    document.getElementById('menuModal').classList.remove('hidden');
}

// Save Item (Add or Update)
document.getElementById('menuItemForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const itemData = {
        name: {
            de: document.getElementById('itemNameDE').value,
            tr: document.getElementById('itemNameTR').value,
            en: document.getElementById('itemNameEN').value
        },
        description: {
            de: document.getElementById('itemDescDE').value,
            tr: document.getElementById('itemDescDE').value, // Simplified: using DE desc for all for now or add fields
            en: document.getElementById('itemDescDE').value
        },
        price: parseFloat(document.getElementById('itemPrice').value),
        image: currentMenuImage
    };

    if (currentEditingId) {
        // Update existing
        const index = menuItems.findIndex(i => i.id === currentEditingId);
        if (index !== -1) {
            menuItems[index] = { ...menuItems[index], ...itemData };
        }
    } else {
        // Add new
        const newId = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1;
        menuItems.push({ id: newId, ...itemData });
    }

    const saved = await saveMenuItems();
    if (saved) {
        showAlert('menuAlert', currentEditingId ? 'Menü Item aktualisiert!' : 'Neues Item hinzugefügt!');
        loadMenuItems();
        document.getElementById('menuModal').classList.add('hidden');
    }
});

async function deleteMenuItem(id) {
    if (confirm('Möchten Sie dieses Item wirklich löschen?')) {
        menuItems = menuItems.filter(i => i.id !== id);
        const saved = await saveMenuItems();
        if (saved) {
            loadMenuItems();
            showAlert('menuAlert', 'Menü Item erfolgreich gelöscht!');
        }
    }
}


// ===================================
// CONTENT MANAGEMENT
// ===================================
document.getElementById('contentForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const contentData = {
        heroTitleDE: document.getElementById('heroTitleDE').value,
        heroTitleTR: document.getElementById('heroTitleTR').value,
        heroTitleEN: document.getElementById('heroTitleEN').value,

        heroSubtitleDE: document.getElementById('heroSubtitleDE').value,
        heroSubtitleTR: document.getElementById('heroSubtitleTR').value,
        heroSubtitleEN: document.getElementById('heroSubtitleEN').value,

        aboutTextDE: document.getElementById('aboutTextDE').value,
        aboutTextTR: document.getElementById('aboutTextTR').value,
        aboutTextEN: document.getElementById('aboutTextEN').value
    };

    try {
        await saveContentToDB('site-content', contentData);
        showAlert('contentAlert', 'Inhalte erfolgreich gespeichert!');
    } catch (error) {
        showAlert('contentAlert', 'Fehler beim Speichern!');
    }
});

// ===================================
// CONTACT MANAGEMENT
// ===================================
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
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

    try {
        await saveContentToDB('contact-info', contactData);
        showAlert('contactAlert', 'Kontaktdaten erfolgreich gespeichert!');
    } catch (error) {
        showAlert('contactAlert', 'Fehler beim Speichern!');
    }
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
    updateMenuCount();
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initNavigation();
});
