# FocusFlow - Daily Discipline Tracker

A modern, premium productivity dashboard built with React and Firebase.

## 🚀 Features

- **Daily Tasks**: Create, edit, and track your daily priorities.
- **Visual Progress**: Real-time completion percentage with animated circular progress.
- **Daily Reflection**: Write commentary on your day to track your mental state.
- **Full History**: Calendar-based history to review past performance.
- **Analytics**: Beautiful charts to visualize your weekly and monthly consistency.
- **Responsive**: Optimized for Mobile, Tablet, and Desktop.
- **Offline First**: Firebase persistence allows usage even without an active internet connection.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **Icons**: Lucide React, React Icons
- **State**: Zustand
- **Database**: Firebase Firestore
- **Charts**: Recharts

## 📦 Setup Instructions

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Firebase Configuration**:
   - Create a project on [Firebase Console](https://console.firebase.google.com/).
   - Enable **Firestore Database**.
   - Create a Web App and copy the `firebaseConfig` object.
   - Paste the config into `src/firebase/config.js`.

4. **Run Locally**:
   ```bash
   npm run dev
   ```

5. **Deployment**:
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login: `firebase login`
   - Initialize: `firebase init` (Select Hosting and Firestore)
   - Build: `npm run build`
   - Deploy: `firebase deploy`

## 🔒 Security Note

This app is designed for personal use. For a public multi-user application, implement Firebase Authentication and Firestore Security Rules.
