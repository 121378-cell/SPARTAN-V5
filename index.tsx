import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from './src/context/AuthContext.tsx';
import { Login } from './src/components/Login.tsx';
import { Dashboard } from './src/components/Dashboard.tsx';
import { isFirebaseConfigured } from './src/services/firebase.ts';
import { FirebaseNotConfigured } from './src/components/FirebaseNotConfigured.tsx';

const AppContent = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Dashboard /> : <Login />;
}

const App = () => {
  // If Firebase is not configured, show a setup guide instead of the app.
  if (!isFirebaseConfigured) {
    return <FirebaseNotConfigured />;
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}