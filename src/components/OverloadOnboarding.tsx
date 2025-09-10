import React, { useState } from 'react';
import { generateOverloadAnalysis, OverloadProfile, OverloadAnalysis } from '../services/gemini.ts';
import { Spinner } from './Spinner.tsx';

interface OverloadOnboardingProps {
    onAnalysisGenerated: (analysis: OverloadAnalysis) => void;
}

export const OverloadOnboarding = ({ onAnalysisGenerated }: OverloadOnboardingProps) => {
    const [profile, setProfile] = useState<OverloadProfile>({
        soreMuscles: '',
        achyJoints: '',
        sorenessLevel: '3',
        discomfortType: 'dull-ache',
        recentIntensity: 'moderate'
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
            const analysis = await generateOverloadAnalysis(profile);
            onAnalysisGenerated(analysis);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-container">
            <h2>Analizar Sobrecarga y Recuperación</h2>
            <p>Informa cualquier fatiga o molestia para obtener un plan personalizado de recuperación y movilidad.</p>
            <form onSubmit={handleSubmit} className="onboarding-form">
                 <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="soreMuscles">Grupos musculares adoloridos (separados por comas)</label>
                        <input type="text" id="soreMuscles" name="soreMuscles" value={profile.soreMuscles} onChange={handleChange} placeholder="ej., cuádriceps, espalda baja" disabled={loading} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="achyJoints">Articulaciones doloridas (separadas por comas)</label>
                        <input type="text" id="achyJoints" name="achyJoints" value={profile.achyJoints} onChange={handleChange} placeholder="ej., rodillas, hombros" disabled={loading} />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="sorenessLevel">Nivel general de dolor/molestia (1-10)</label>
                    <input type="range" id="sorenessLevel" name="sorenessLevel" min="1" max="10" value={profile.sorenessLevel} onChange={handleChange} disabled={loading} />
                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{profile.sorenessLevel}</div>
                </div>


                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="discomfortType">Tipo de Molestia</label>
                        <select id="discomfortType" name="discomfortType" value={profile.discomfortType} onChange={handleChange} disabled={loading}>
                            <option value="dull-ache">Dolor Sordo</option>
                            <option value="stiffness">Rigidez</option>
                            <option value="tightness">Tensión</option>
                            <option value="sharp-pain">Dolor Agudo</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="recentIntensity">Intensidad del Entrenamiento Reciente</label>
                         <select id="recentIntensity" name="recentIntensity" value={profile.recentIntensity} onChange={handleChange} disabled={loading}>
                            <option value="low">Baja</option>
                            <option value="moderate">Moderada</option>
                            <option value="high">Alta</option>
                            <option value="very-high">Muy Alta / Esfuerzo Máximo</option>
                        </select>
                    </div>
                </div>

                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? <Spinner /> : 'Analizar Mi Condición'}
                </button>
            </form>
        </div>
    );
};