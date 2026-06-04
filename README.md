# 🚀 Personal Portfolio Website (Firebase Powered)

A modern personal portfolio website designed as a dynamic **data-driven shell**, where all content (projects, skills, certificates, images, resume, and contact details) is fetched directly from Firebase Firestore and Firebase Storage.

---

## 📌 Project Overview

This project is a fully responsive personal portfolio that dynamically loads all content from Firebase. Instead of hardcoding data, the website acts as a frontend shell that displays real-time content managed in the cloud.

It is built to showcase:

- Academic projects
- Personal projects
- Technical skills
- Certificates
- Profile information
- Contact and social links

---

## ⚙️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS)
- **Backend (BaaS):** Firebase (Google Firebase platform)
  - Firestore Database (data storage)
  - Firebase Storage (images, resume, certificates)
- **Hosting:** Firebase Hosting (optional)
- **Version Control:** Git & GitHub

---

## 📂 Features

- 🔥 Dynamic content loading from Firebase
- 📁 Projects section (name, image, description, live link)
- 🧠 Skills section (fetched from database)
- 🏆 Certificates gallery (stored in Firebase Storage)
- 👤 About section (editable via Firestore)
- 📞 Contact details + social media links
- 📱 Fully responsive design (mobile + desktop)
- ⚡ Fast loading with minimal frontend logic

---

## 🗂️ Project Structure

/portfolio-project
│
├── index.html
├── about.html
├── projects.html
├── skills.html
├── contact.html
│
├── /assets
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── firebase-config.js
│   │   ├── app.js
│   │   └── data-loader.js
│   └── images/
│
├── /components
│   ├── navbar.html
│   ├── footer.html
│
├── /firebase
│   └── config.js
│
└── README.md

---

## 🔥 Firebase Setup

### 1. Create Firebase Project
Go to the Firebase Console and create a new project.

### 2. Enable Services
- Firestore Database (start in test mode)
- Firebase Storage
- Firebase Hosting (optional)

### 3. Firestore Collections Structure

#### 📁 projects
{
  "title": "Project Name",
  "description": "Project description",
  "imageUrl": "https://...",
  "liveLink": "https://..."
}

#### 📁 skills
{
  "name": "JavaScript",
  "level": "Advanced"
}

#### 📁 profile
{
  "name": "Your Name",
  "bio": "Short bio",
  "email": "you@email.com",
  "location": "Pretoria, South Africa"
}

#### 📁 certificates
{
  "title": "Certificate Name",
  "imageUrl": "https://..."
}

---

## 🚀 Getting Started

### 1. Clone the repository
git clone https://github.com/your-username/portfolio.git

### 2. Navigate into the project
cd portfolio

### 3. Add Firebase config
/assets/js/firebase-config.js

### 4. Run the project
Open index.html in browser or use Live Server in VS Code

---

## 📸 Future Improvements

- Admin dashboard (optional)
- Blog section
- Dark / Light mode toggle
- Scroll animations
- Analytics integration

---

## 👨‍💻 Author

Your Name  
IT Student | Developer | Tech Enthusiast  
📍 Pretoria, South Africa  

---

## 📄 License

This project is licensed under the MIT License.
