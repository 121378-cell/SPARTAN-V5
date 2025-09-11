import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase.ts';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in AuthContext will handle the redirect
    } catch (err: any) {
      setError('Error logging in. Please check your credentials.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Spartan AI</h1>
      <p className="login-subtitle">Tu entrenador personal definitivo</p>
      <form onSubmit={handleLogin} className="login-form">
        <div className="login-input-group">
          <label htmlFor="email" className="login-label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
            disabled={loading}
          />
        </div>
        <div className="login-input-group">
          <label htmlFor="password" className="login-label">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};
