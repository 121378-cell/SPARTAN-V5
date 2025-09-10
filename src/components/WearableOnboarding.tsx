import React, { useState } from 'react';
import { generateWearableInsights, WearableData, WearableInsights } from '../services/gemini.ts';
import { Spinner } from './Spinner.tsx';

interface WearableOnboardingProps {
    onInsightsGenerated: (insights: WearableInsights) => void;
}

export const WearableOnboarding = ({ onInsightsGenerated }: WearableOnboardingProps) => {
    const [data, setData] = useState<WearableData>({
        device: 'garmin',
        sleepDuration: '7h 45m',
        restingHr: '55',
        hrv: '68',
        steps: '10200',
        calories: '2500',
        recoveryStatus: 'Good'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const plan = await generateWearableInsights(data);
            onInsightsGenerated(plan);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wearable-onboarding-container">
            <h2>Analiza tus Datos de Wearable</h2>
            <p>Introduce las métricas de hoy de tu dispositivo para obtener información personalizada impulsada por IA.</p>
            <form onSubmit={handleSubmit} className="wearable-form">
                <div className="form-group">
                    <label htmlFor="device">¿Qué dispositivo estás usando?</label>
                    <select id="device" name="device" value={data.device} onChange={handleChange} disabled={loading}>
                        <option value="garmin">Garmin</option>
                        <option value="apple-watch">Apple Watch</option>
                        <option value="fitbit">Fitbit</option>
                        <option value="oura">Oura Ring</option>
                        <option value="whoop">Whoop</option>
                        <option value="other">Otro</option>
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="sleepDuration">Duración del Sueño</label>
                        <input type="text" id="sleepDuration" name="sleepDuration" value={data.sleepDuration} onChange={handleChange} placeholder="ej., 8h 15m" required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="recoveryStatus">Estado de Recuperación</label>
                        <select id="recoveryStatus" name="recoveryStatus" value={data.recoveryStatus} onChange={handleChange} disabled={loading}>
                            <option value="Excellent">Excelente</option>
                            <option value="Good">Bueno</option>
                            <option value="Fair">Regular</option>
                            <option value="Poor">Pobre</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="restingHr">FC en Reposo (lpm)</label>
                        <input type="number" id="restingHr" name="restingHr" value={data.restingHr} onChange={handleChange} placeholder="ej., 55" required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hrv">VFC (ms)</label>
                        <input type="number" id="hrv" name="hrv" value={data.hrv} onChange={handleChange} placeholder="ej., 65" required disabled={loading} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="steps">Pasos</label>
                        <input type="number" id="steps" name="steps" value={data.steps} onChange={handleChange} placeholder="ej., 10000" required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="calories">Calorías Quemadas (kcal)</label>
                        <input type="number" id="calories" name="calories" value={data.calories} onChange={handleChange} placeholder="ej., 2500" required disabled={loading} />
                    </div>
                </div>


                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? <Spinner /> : 'Analizar Mis Datos'}
                </button>
            </form>
        </div>
    );
};