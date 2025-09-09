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
            <h2>Create Your Nutrition Plan</h2>
            <p>Tell us about your diet to generate a personalized nutrition plan.</p>
            <form onSubmit={handleSubmit} className="nutrition-form">
                <div className="form-group">
                    <label htmlFor="goal">What is your primary nutrition goal?</label>
                    <select id="goal" name="goal" value={profile.goal} onChange={handleChange} disabled={loading}>
                        <option value="lose-fat">Lose Fat</option>
                        <option value="maintain-weight">Maintain Weight</option>
                        <option value="gain-muscle">Gain Muscle</option>
                        <option value="improve-performance">Improve Performance</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="diet">What are your dietary preferences?</label>
                    <select id="diet" name="diet" value={profile.diet} onChange={handleChange} disabled={loading}>
                        <option value="omnivore">Omnivore</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="pescatarian">Pescatarian</option>
                    </select>
                </div>
                 <div className="form-group">
                    <label htmlFor="mealsPerDay">How many meals do you prefer per day?</label>
                    <select id="mealsPerDay" name="mealsPerDay" value={profile.mealsPerDay} onChange={handleChange} disabled={loading}>
                        <option value="3">3 meals</option>
                        <option value="4">4 meals</option>
                        <option value="5">5 meals</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="allergies">Allergies or restrictions (comma-separated)</label>
                    <input
                        type="text"
                        id="allergies"
                        name="allergies"
                        value={profile.allergies}
                        onChange={handleChange}
                        placeholder="e.g., gluten, dairy, nuts"
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dislikedFoods">Foods to avoid (comma-separated)</label>
                    <input
                        type="text"
                        id="dislikedFoods"
                        name="dislikedFoods"
                        value={profile.dislikedFoods}
                        onChange={handleChange}
                        placeholder="e.g., broccoli, tofu"
                        disabled={loading}
                    />
                </div>

                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? <Spinner /> : 'Generate My Nutrition Plan'}
                </button>
            </form>
        </div>
    );
};