// Implemented the Onboarding component to resolve module errors.
import React, { useState } from 'react';
import { generateWorkoutPlan, UserProfile, WorkoutPlan } from '../services/gemini';
import { Spinner } from './Spinner';

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
            <h2>Create Your Spartan Plan</h2>
            <p>Tell us about yourself to generate a personalized workout plan.</p>
            <form onSubmit={handleSubmit} className="onboarding-form">
                <div className="form-group">
                    <label htmlFor="goal">What is your primary fitness goal?</label>
                    <select id="goal" name="goal" value={profile.goal} onChange={handleChange} disabled={loading}>
                        <option value="build-muscle">Build Muscle</option>
                        <option value="lose-fat">Lose Fat</option>
                        <option value="increase-strength">Increase Strength</option>
                        <option value="improve-endurance">Improve Endurance</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="level">What is your experience level?</label>
                    <select id="level" name="level" value={profile.level} onChange={handleChange} disabled={loading}>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="daysPerWeek">How many days per week can you train?</label>
                    <select id="daysPerWeek" name="daysPerWeek" value={profile.daysPerWeek} onChange={handleChange} disabled={loading}>
                        <option value="2">2 days</option>
                        <option value="3">3 days</option>
                        <option value="4">4 days</option>
                        <option value="5">5 days</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="equipment">What equipment do you have access to?</label>
                    <select id="equipment" name="equipment" value={profile.equipment} onChange={handleChange} disabled={loading}>
                        <option value="bodyweight">Bodyweight only</option>
                        <option value="dumbbells">Dumbbells</option>
                        <option value="basic-gym">Basic Gym (Dumbbells, Barbells, Racks)</option>
                        <option value="full-gym">Full Gym (Machines, etc.)</option>
                    </select>
                </div>
                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? <Spinner /> : 'Generate My Plan'}
                </button>
            </form>
        </div>
    );
};
