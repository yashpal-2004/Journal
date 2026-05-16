# Journal 🖋️
### A Tactile, Pen-and-Paper Style Productivity Journal

Journal is a premium, high-performance productivity dashboard designed for users who crave the tactile feeling of a physical journal but need the power of a digital workflow. It features a bespoke "Pen and Paper" aesthetic, real-time cloud synchronization, and an interactive Kanban-style task management system.

![App Screenshot](public/screenshot.png) *(Note: Add your actual screenshot here)*

## ✨ Core Philosophy
Journal is built on the idea that planning your day should feel intentional. By combining a "Handwritten" UI with modern drag-and-drop interactions, the app provides a workspace that feels alive and tactile.

## 🚀 Key Features

- **🖋️ Pen-and-Paper Aesthetic**: A custom-designed UI using Google Fonts like *Outfit* and *Satisfy* to simulate a high-end stationery experience.
- **📋 Smart Kanban Board**: Full-card drag-and-drop interaction. Move tasks between **Priorities**, **Daily Routine**, and **Done** with ease.
- **📅 Daily Blueprint**: Manage a master routine in Settings. Every new day gives you the option to "Load Plan" or start with a fresh slate.
- **☁️ Real-Time Cloud Sync**: Powered by Firebase Firestore. Your progress, streaks, and reflections are saved instantly across all devices.
- **🧠 Daily Reflections**: A dedicated journaling modal to scribble down your thoughts and analyze your day's performance.
- **📊 Performance Analytics**: Track your consistency with circular progress scores, streaks, and historical performance charts.
- **⚡ Zero-Lag Performance**: Optimized component architecture ensuring that even long reflections don't slow down the main board.

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS & Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Backend**: Firebase (Firestore & Auth)
- **Charts**: Recharts

## 📦 Getting Started

1. **Clone the Repo**
   ```bash
   git clone https://github.com/yashpal-2004/Journal.git
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a project at [Firebase Console](https://console.firebase.google.com/).
   - Add a Web App to your project.
   - Copy your configuration and paste it into `src/firebase/config.js`.

4. **Launch Dev Server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```text
src/
├── components/ # Shared UI elements
├── firebase/   # Firebase configuration
├── pages/      # Main application views (Dashboard, History, Settings)
├── store/      # Zustand state management
└── assets/     # Global styles and branding
```

## 📝 License
This project is open-source and available under the MIT License.

---
*Handcrafted for focus and clarity.*
