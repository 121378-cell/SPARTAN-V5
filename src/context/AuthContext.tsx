import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../services/firebase.ts';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { Spinner } from '../components/Spinner.tsx';

interface AuthContextType {
  currentUser: User | null;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
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
