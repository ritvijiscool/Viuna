# Viuna - Come to Veggie 🌱

A modern, visually stunning website for an authentic Turkish Çiğ Köfte restaurant. 100% vegan, 100% delicious.

## 🌟 Features

- **Multilingual Support**: Full support for German (DE), Turkish (TR), and English (EN)
- **Responsive Design**: Beautiful on all devices - desktop, tablet, and mobile
- **Admin Panel**: Easy content management for menu items, gallery, and site content
- **Modern UI**: Vibrant colors, smooth animations, and glassmorphism effects
- **SEO Optimized**: Proper meta tags, semantic HTML, and fast loading times
- **Netlify Ready**: Deploy instantly to Netlify with automatic HTTPS and CDN

## 🚀 Quick Start

### Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ViunaAGG
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

3. Visit `http://localhost:8000` in your browser

### Admin Panel Access

- URL: `/admin.html`
- Username: `admin`
- Password: `viuna2024`

## 📁 Project Structure

```
ViunaAGG/
├── index.html              # Main website
├── admin.html              # Admin panel
├── css/
│   ├── styles.css          # Main design system
│   └── admin.css           # Admin panel styles
├── js/
│   ├── main.js             # Main website logic
│   ├── translations.js     # Multilingual content
│   └── admin.js            # Admin panel logic
├── images/                 # Food images and assets
├── data/
│   └── menu.json           # Menu data (optional)
├── .gitignore
├── netlify.toml            # Netlify configuration
└── README.md
```

## 🌐 Deployment to Netlify

### Method 1: Connect GitHub Repository

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [Netlify](https://netlify.com) and sign in
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub account and select your repository
5. Configure build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `/` (root)
6. Click "Deploy site"

### Method 2: Drag and Drop

1. Build your site (no build step needed for this static site)
2. Go to [Netlify](https://netlify.com)
3. Drag and drop the entire project folder to Netlify

Your site will be live at `https://your-site-name.netlify.app`

## 🎨 Customization

### Colors

Edit the CSS variables in `css/styles.css`:

```css
:root {
  --color-primary-green: #2D8659;
  --color-orange: #E8744F;
  --color-terracotta: #D4654D;
  /* ... */
}
```

### Content

- **Main Website**: Edit translations in `js/translations.js`
- **Admin Panel**: Use the admin interface at `/admin.html`

### Google Maps

Update the Google Maps embed URL in `index.html` with your actual restaurant location:

```html
<iframe src="YOUR_GOOGLE_MAPS_EMBED_URL" ...></iframe>
```

## 📱 Language Support

The website automatically detects and remembers the user's language preference. Supported languages:

- 🇩🇪 German (Deutsch) - Default
- 🇹🇷 Turkish (Türkçe)
- 🇬🇧 English

Add or modify translations in `js/translations.js`.

## 🔒 Admin Panel Features

- **Menu Management**: Add, edit, and delete menu items with multilingual descriptions
- **Gallery**: Upload and manage food images
- **Content Editor**: Update hero text, about section, and page content
- **Contact Info**: Manage address, phone, email, social media, and opening hours

**Note**: The admin panel uses localStorage for data persistence. For production use with multiple devices, consider integrating a backend service or headless CMS.

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, animations
- **JavaScript (ES6+)**: Vanilla JS, no frameworks
- **Google Fonts**: Inter font family
- **LocalStorage**: Client-side data persistence

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

© 2024 Viuna - Come to Veggie. All rights reserved.

## 🤝 Support

For questions or support, contact: info@viuna.de

---

**Built with 🌱 and ❤️ for authentic Turkish cuisine**
