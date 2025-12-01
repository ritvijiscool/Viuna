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

function loadMenuItems() {
    const tbody = document.getElementById('menuTableBody');
    if (!tbody) return;

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

function saveMenuItems() {
    localStorage.setItem('viuna-menu-items', JSON.stringify(menuItems));
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
document.getElementById('menuItemForm')?.addEventListener('submit', (e) => {
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
            showAlert('menuAlert', 'Menü Item aktualisiert!');
        }
    } else {
        // Add new
        const newId = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1;
        menuItems.push({ id: newId, ...itemData });
        showAlert('menuAlert', 'Neues Item hinzugefügt!');
    }

    saveMenuItems();
    loadMenuItems();
    document.getElementById('menuModal').classList.add('hidden');
});

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
            card.draggable = true; // Enable drag
            card.dataset.index = index;
            card.innerHTML = `
        <img src="${img.data}" alt="${img.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: var(--spacing-sm);">
        <p style="font-size: 0.875rem; margin-bottom: var(--spacing-sm);">${img.name}</p>
        <button class="btn btn-sm btn-danger" onclick="deleteImage(${index})">Löschen</button>
      `;

            // Drag events
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragover', handleDragOver);
            card.addEventListener('drop', handleDrop);
            card.addEventListener('dragenter', handleDragEnter);
            card.addEventListener('dragleave', handleDragLeave);

            grid.appendChild(card);
        });
    }

    updateGalleryCount();
}

// Drag and Drop Handlers
let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcEl !== this) {
        const srcIndex = parseInt(dragSrcEl.dataset.index);
        const targetIndex = parseInt(this.dataset.index);

        // Swap items in array
        const temp = galleryImages[srcIndex];
        galleryImages[srcIndex] = galleryImages[targetIndex];
        galleryImages[targetIndex] = temp;

        saveGallery();
        loadGallery();
    }

    return false;
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
        heroTitleTR: document.getElementById('heroTitleTR').value,
        heroTitleEN: document.getElementById('heroTitleEN').value,

        heroSubtitleDE: document.getElementById('heroSubtitleDE').value,
        heroSubtitleTR: document.getElementById('heroSubtitleTR').value,
        heroSubtitleEN: document.getElementById('heroSubtitleEN').value,

        aboutTextDE: document.getElementById('aboutTextDE').value,
        aboutTextTR: document.getElementById('aboutTextTR').value,
        aboutTextEN: document.getElementById('aboutTextEN').value
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
