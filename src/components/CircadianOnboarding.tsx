import React, { useState } from 'react';
import { generateCircadianPlan, CircadianProfile, CircadianPlan } from '../services/gemini.ts';
import { Spinner } from './Spinner.tsx';

interface CircadianOnboardingProps {
    onPlanGenerated: (plan: CircadianPlan) => void;
}

export const CircadianOnboarding = ({ onPlanGenerated }: CircadianOnboardingProps) => {
    const [profile, setProfile] = useState<CircadianProfile>({
        wakeTime: '07:00',
        sleepTime: '23:00',
        activityWindow: 'afternoon',
        sleepIssues: ''
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
            const plan = await generateCircadianPlan(profile);
            onPlanGenerated(plan);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="circadian-onboarding-container">
            <h2>Sincroniza tu Ritmo Circadiano</h2>
            <p>Optimiza tu día alineando tus actividades con tu reloj interno.</p>
            <form onSubmit={handleSubmit} className="circadian-form">
                <div className="form-group">
                    <label htmlFor="wakeTime">¿A qué hora te despiertas normalmente?</label>
                    <input
                        type="time"
                        id="wakeTime"
                        name="wakeTime"
                        value={profile.wakeTime}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="sleepTime">¿A qué hora te acuestas normalmente?</label>
                     <input
                        type="time"
                        id="sleepTime"
                        name="sleepTime"
                        value={profile.sleepTime}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>
                 <div className="form-group">
                    <label htmlFor="activityWindow">¿Cuándo estás más activo o cuándo prefieres entrenar?</label>
                    <select id="activityWindow" name="activityWindow" value={profile.activityWindow} onChange={handleChange} disabled={loading}>
                        <option value="morning">Mañana (6am - 10am)</option>
                        <option value="mid-day">Mediodía (10am - 2pm)</option>
                        <option value="afternoon">Tarde (2pm - 6pm)</option>
                        <option value="evening">Noche (6pm - 9pm)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="sleepIssues">¿Tienes algún problema específico de sueño? (opcional)</label>
                    <input
                        type="text"
                        id="sleepIssues"
                        name="sleepIssues"
                        value={profile.sleepIssues}
                        onChange={handleChange}
                        placeholder="ej., dificultad para conciliar el sueño, despertarse por la noche"
                        disabled={loading}
                    />
                </div>

                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? <Spinner /> : 'Generar Mi Plan Circadiano'}
                </button>
            </form>
        </div>
    );
};