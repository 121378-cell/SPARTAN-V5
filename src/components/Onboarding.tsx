// Implemented the Onboarding component to resolve module errors.
import React, { useState } from 'react';
import { generateWorkoutPlan, UserProfile, WorkoutPlan } from '../services/gemini.ts';
import { Spinner } from './Spinner.tsx';

interface OnboardingProps {
    onPlanGenerated: (plan: WorkoutPlan) => void;
}

export const Onboarding = ({ onPlanGenerated }: OnboardingProps) => {
    const [profile, setProfile] = useState<UserProfile>({
        goal: 'build-muscle',
        level: 'beginner',
        daysPerWeek: '3',
        equipment: 'basic-gym'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const plan = await generateWorkoutPlan(profile);
            onPlanGenerated(plan);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-container">
            <h2>Crea tu Plan Espartano</h2>
            <p>Cuéntanos sobre ti para generar un plan de entrenamiento personalizado.</p>
            <form onSubmit={handleSubmit} className="onboarding-form">
                <div className="form-group">
                    <label htmlFor="goal">¿Cuál es tu principal objetivo de fitness?</label>
                    <select id="goal" name="goal" value={profile.goal} onChange={handleChange} disabled={loading}>
                        <option value="build-muscle">Desarrollar Músculo</option>
                        <option value="lose-fat">Perder Grasa</option>
                        <option value="increase-strength">Aumentar Fuerza</option>
                        <option value="improve-endurance">Mejorar Resistencia</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="level">¿Cuál es tu nivel de experiencia?</label>
                    <select id="level" name="level" value={profile.level} onChange={handleChange} disabled={loading}>
                        <option value="beginner">Principiante</option>
                        <option value="intermediate">Intermedio</option>
                        <option value="advanced">Avanzado</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="daysPerWeek">¿Cuántos días a la semana puedes entrenar?</label>
                    <select id="daysPerWeek" name="daysPerWeek" value={profile.daysPerWeek} onChange={handleChange} disabled={loading}>
                        <option value="2">2 días</option>
                        <option value="3">3 días</option>
                        <option value="4">4 días</option>
                        <option value="5">5 días</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="equipment">¿A qué equipo tienes acceso?</label>
                    <select id="equipment" name="equipment" value={profile.equipment} onChange={handleChange} disabled={loading}>
                        <option value="bodyweight">Solo peso corporal</option>
                        <option value="dumbbells">Mancuernas</option>
                        <option value="basic-gym">Gimnasio Básico (Mancuernas, Barras, Racks)</option>
                        <option value="full-gym">Gimnasio Completo (Máquinas, etc.)</option>
                    </select>
                </div>
                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? <Spinner /> : 'Generar Mi Plan'}
                </button>
            </form>
        </div>
    );
};