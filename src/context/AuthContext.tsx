import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// FIX: Using Firebase v8 compatibility imports and types to resolve module loading errors.
import firebase from 'firebase/app';
import 'firebase/auth';
import { auth } from '../services/firebase.ts';
import { Spinner } from '../components/Spinner.tsx';

interface AuthContextType {
  // FIX: Using Firebase v8 User type.
  currentUser: firebase.User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // FIX: Using Firebase v8 User type.
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: Using Firebase v8 onAuthStateChanged method from the auth instance.
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      // FIX: Using Firebase v8 signOut method from the auth instance.
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const value = {
    currentUser,
    loading,
    logout,
  };

  // Muestra un spinner mientras se verifica el estado de autenticación
  if (loading) {
    // Agregamos un contenedor para centrar el spinner
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
