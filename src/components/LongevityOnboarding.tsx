import React, { useState } from 'react';
import { generateLongevityReport, LongevityProfile, LongevityReport } from '../services/gemini.ts';
import { Spinner } from './Spinner.tsx';

interface LongevityOnboardingProps {
    onReportGenerated: (report: LongevityReport) => void;
}

export const LongevityOnboarding = ({ onReportGenerated }: LongevityOnboardingProps) => {
    const [profile, setProfile] = useState<LongevityProfile>({
        bodyweight: '80',
        bodyFatPercentage: '15',
        squatMax: '120',
        benchMax: '90',
        deadliftMax: '150',
        avgSleepDuration: '7h 30m',
        sleepQuality: 'Good',
        vo2Max: '45'
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
            const report = await generateLongevityReport(profile);
            onReportGenerated(report);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="longevity-onboarding-container">
            <h2>Generar Informe Semanal de Longevidad</h2>
            <p>Introduce tus métricas clave de la última semana para un análisis detallado de salud y longevidad.</p>
            <form onSubmit={handleSubmit} className="longevity-form">

                <h4>Composición Corporal</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="bodyweight">Peso Corporal (kg)</label>
                        <input type="number" id="bodyweight" name="bodyweight" value={profile.bodyweight} onChange={handleChange} required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bodyFatPercentage">% Grasa Corporal (opcional)</label>
                        <input type="number" id="bodyFatPercentage" name="bodyFatPercentage" value={profile.bodyFatPercentage} onChange={handleChange} disabled={loading} />
                    </div>
                </div>

                <h4>Fuerza (1-Rep Max en kg)</h4>
                <div className="form-row-tri">
                    <div className="form-group">
                        <label htmlFor="squatMax">Sentadilla</label>
                        <input type="number" id="squatMax" name="squatMax" value={profile.squatMax} onChange={handleChange} required disabled={loading} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="benchMax">Press de Banca</label>
                        <input type="number" id="benchMax" name="benchMax" value={profile.benchMax} onChange={handleChange} required disabled={loading} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="deadliftMax">Peso Muerto</label>
                        <input type="number" id="deadliftMax" name="deadliftMax" value={profile.deadliftMax} onChange={handleChange} required disabled={loading} />
                    </div>
                </div>

                <h4>Sueño y Cardio</h4>
                 <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="avgSleepDuration">Duración Promedio del Sueño</label>
                        <input type="text" id="avgSleepDuration" name="avgSleepDuration" value={profile.avgSleepDuration} onChange={handleChange} placeholder="ej., 7h 45m" required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sleepQuality">Calidad de Sueño Subjetiva</label>
                        <select id="sleepQuality" name="sleepQuality" value={profile.sleepQuality} onChange={handleChange} disabled={loading}>
                            <option value="Excellent">Excelente</option>
                            <option value="Good">Bueno</option>
                            <option value="Fair">Regular</option>
                            <option value="Poor">Pobre</option>
                        </select>
                    </div>
                </div>
                 <div className="form-group">
                    <label htmlFor="vo2Max">VO2 Máx. Estimado (mL/kg/min)</label>
                    <input type="number" id="vo2Max" name="vo2Max" value={profile.vo2Max} onChange={handleChange} required disabled={loading} />
                </div>


                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? <Spinner /> : 'Generar Mi Informe'}
                </button>
            </form>
        </div>
    );
};