# Touri

A modern full-stack application built with React, Create React App, and Firebase.

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Firebase project (for backend features)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Touri
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase configuration
   - Create a `.env` file in the project root
   - Add your Firebase configuration variables:
   ```bash
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## 🛠️ Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

## 📁 Project Structure

```
Touri/
├── public/
│   └── index.html           # HTML template
├── src/
│   ├── components/
│   │   └── Auth.js          # Authentication component
│   ├── contexts/
│   │   └── AuthContext.js   # Authentication context
│   ├── firebase/
│   │   ├── config.js        # Firebase configuration
│   │   ├── auth.js          # Authentication functions
│   │   └── firestore.js     # Firestore database functions
│   ├── App.jsx              # Main React component
│   ├── App.css              # Component styles
│   ├── index.js             # React entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables (not committed)
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🔥 Firebase Integration

### Features Included
- ✅ **Firebase Authentication** - Email/password sign up and sign in
- ✅ **Firestore Database** - NoSQL database for storing data
- ✅ **Environment Variables** - Secure configuration management
- ✅ **React Context** - Global authentication state management
- ✅ **Security Best Practices** - Proper configuration handling

### Available Functions
- **Authentication**: `signUp()`, `signIn()`, `signOut()`, `onAuthStateChange()`
- **Firestore**: `addDocument()`, `getDocuments()`, `updateDocument()`, `deleteDocument()`
- **Context**: `useAuth()` hook for accessing user state

## 🎨 Features

- ⚡ Fast development with Create React App
- ⚛️ Modern React 18 with hooks
- 🔥 Firebase backend integration
- 🔐 Secure authentication system
- 📱 Responsive design
- 🎨 Beautiful UI with gradient styling
- 🔥 Hot module replacement
- 🧪 Built-in testing with Jest
- 📦 Optimized production builds
- 🔒 Environment variable security

## 🚧 Development

This is a full-stack project with:
- **Frontend**: React with Create React App
- **Backend**: Firebase (Authentication + Firestore)
- **Security**: Environment variables and Firebase rules
- **Ready for**: User authentication, data storage, and real-time features

## 🔧 Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Get your Firebase configuration
5. Add configuration to `.env` file

## 📝 License

This project is licensed under the MIT License.
