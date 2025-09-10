import React, { useState } from 'react';
import { generateNutritionPlan, NutritionProfile, NutritionPlan } from '../services/gemini.ts';
import { Spinner } from './Spinner.tsx';

interface NutritionOnboardingProps {
    onPlanGenerated: (plan: NutritionPlan) => void;
}

export const NutritionOnboarding = ({ onPlanGenerated }: NutritionOnboardingProps) => {
    const [profile, setProfile] = useState<NutritionProfile>({
        goal: 'lose-fat',
        diet: 'omnivore',
        allergies: '',
        dislikedFoods: '',
        mealsPerDay: '4'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const plan = await generateNutritionPlan(profile);
            onPlanGenerated(plan);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="nutrition-onboarding-container">
            <h2>Crea tu Plan de Nutrición</h2>
            <p>Cuéntanos sobre tu dieta para generar un plan de nutrición personalizado.</p>
            <form onSubmit={handleSubmit} className="nutrition-form">
                <div className="form-group">
                    <label htmlFor="goal">¿Cuál es tu principal objetivo de nutrición?</label>
                    <select id="goal" name="goal" value={profile.goal} onChange={handleChange} disabled={loading}>
                        <option value="lose-fat">Perder Grasa</option>
                        <option value="maintain-weight">Mantener Peso</option>
                        <option value="gain-muscle">Ganar Músculo</option>
                        <option value="improve-performance">Mejorar Rendimiento</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="diet">¿Cuáles son tus preferencias dietéticas?</label>
                    <select id="diet" name="diet" value={profile.diet} onChange={handleChange} disabled={loading}>
                        <option value="omnivore">Omnívoro</option>
                        <option value="vegetarian">Vegetariano</option>
                        <option value="vegan">Vegano</option>
                        <option value="pescatarian">Pescatariano</option>
                    </select>
                </div>
                 <div className="form-group">
                    <label htmlFor="mealsPerDay">¿Cuántas comidas prefieres al día?</label>
                    <select id="mealsPerDay" name="mealsPerDay" value={profile.mealsPerDay} onChange={handleChange} disabled={loading}>
                        <option value="3">3 comidas</option>
                        <option value="4">4 comidas</option>
                        <option value="5">5 comidas</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="allergies">Alergias o restricciones (separadas por comas)</label>
                    <input
                        type="text"
                        id="allergies"
                        name="allergies"
                        value={profile.allergies}
                        onChange={handleChange}
                        placeholder="ej., gluten, lácteos, frutos secos"
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dislikedFoods">Alimentos a evitar (separados por comas)</label>
                    <input
                        type="text"
                        id="dislikedFoods"
                        name="dislikedFoods"
                        value={profile.dislikedFoods}
                        onChange={handleChange}
                        placeholder="ej., brócoli, tofu"
                        disabled={loading}
                    />
                </div>

                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? <Spinner /> : 'Generar Mi Plan de Nutrición'}
                </button>
            </form>
        </div>
    );
};