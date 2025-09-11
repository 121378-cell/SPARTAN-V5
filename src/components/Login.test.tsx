import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Login } from './Login.tsx';
import { vi as vitest } from 'vitest';

const { signInWithEmailAndPassword } = vi.hoisted(() => {
    return {
        signInWithEmailAndPassword: vi.fn(),
    };
});

// Mock firebase auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword,
}));

// Mock firebase services
vi.mock('../services/firebase.ts', () => ({
    auth: {}
}));

describe('Login', () => {
  it('should call signInWithEmailAndPassword with email and password', async () => {
    const { getByLabelText, getByText } = render(<Login />);

    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Contraseña');
    const loginButton = getByText('Iniciar Sesión');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
            expect.any(Object),
            'test@example.com',
            'password123'
        );
    });
  });
});
