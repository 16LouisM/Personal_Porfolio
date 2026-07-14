# Louis Mashele — Personal Portfolio

A responsive personal portfolio site with a vanilla HTML/CSS/JS frontend and a Firebase backend. Profile info, skills, projects, and certificates are stored in Firestore and Storage rather than hardcoded, so the site content can be updated without touching the markup.

**Live features:** dark/light theme toggle, animated typing hero, scroll-reveal animations, a mobile slide-in nav, and glass-style cards throughout.

---

## Tech stack

- **Frontend:** HTML5, CSS3 (custom properties, no framework), vanilla JavaScript (ES modules)
- **Backend:** Firebase
  - Firestore — profile, skills, projects, certificates, contact info
  - Firebase Storage — images, certificate scans, CV/résumé
- **Fonts:** Sora (headings), Inter (body), JetBrains Mono (nav/kickers) via Google Fonts
- **Icons:** Font Awesome, Devicon

---

## Project structure

```
.
├── index.html                 # Single-page shell — sections mount here
├── components/
│   └── navbar.html            # Injected into #navbar-container at runtime
│
├── css/
│   ├── variables.css          # Design tokens — colors, fonts, glass surfaces (single source of truth)
│   ├── main.css                # Reset, base type, buttons, shared section-header/card components
│   ├── navbar.css
│   ├── hero.css
│   ├── about.css
│   ├── skills.css
│   ├── projects.css
│   ├── certificates.css
│   ├── contact.css
│   ├── footer.css
│   ├── animations.css
│   └── responsive.css          # Container/section fluid scaling only
│
├── js/
│   ├── main.js                 # Boot sequence — runs on DOMContentLoaded
│   ├── firebase-config.js      # Firebase app/Firestore init
│   ├── modules/                # navbar, theme toggle, typing effect, scroll animations, counters
│   ├── pages/                  # per-section init (about, skills, projects, certificates, contact)
│   ├── services/               # Firestore reads per collection
│   └── ui/                     # DOM rendering for each section
│
├── firebase/                    # firebase.json, Firestore rules/indexes (for `firebase deploy`)
├── data/
│   └── firebase-schema.json     # Reference schema for seeding Firestore
├── assets/
│   ├── images/                  # profile, about, project screenshots, certificates
│   └── folders/                 # CV/résumé PDF
└── README.md
```

---

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/16LouisM/Personal_Porfolio.git
cd Personal_Porfolio
```

### 2. Set up Firebase

1. Create a project at the [Firebase console](https://console.firebase.google.com/).
2. Enable **Firestore Database** and **Storage**.
3. Copy your web app config into `js/firebase-config.js`:

   ```js
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

4. Seed Firestore with the collections below (see `data/firebase-schema.json` for the reference shape).

### 3. Serve it locally

This is a static site with ES modules, so it needs to be served over HTTP (not opened via `file://`) for imports and Firestore to work.

```bash
npx serve .
# or, in VS Code, use the Live Server extension
```

Then open the printed local URL in your browser.

### 4. Deploy (optional)

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

---

## Firestore collections

| Collection          | Shape (example)                                                            |
| -------------------- | --------------------------------------------------------------------------- |
| `profile`             | `{ name, role, bio, description, email, location, cvUrl, imageUrl }`        |
| `skills`               | `{ category, items: [{ name, icon, level }] }`                              |
| `projects`             | `{ title, description, imageUrl, gallery, techStack, githubUrl, liveUrl }`  |
| `certificates`         | `{ title, issuer, date, imageUrl, description }`                            |
| `contact` / `socials` | `{ email, phone, location, socials: [{ platform, url }] }`                  |

Exact field names are read in `js/services/*.js` and rendered in `js/ui/*.js` — check those if you're adapting the schema.

---

## Customizing the design

All colors, fonts, and "glass card" surface tokens live in `css/variables.css` — change a value there and it propagates everywhere (light and dark themes are both defined in that one file). Section-level layout and animations live in each section's own CSS file.

---

## License

See the [LICENSE](./LICENSE) file.

---

## Author

**Louis Mashele**
IT Graduate · Developer
Pretoria, South Africa
