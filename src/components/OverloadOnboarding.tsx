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
            <h2>Analyze Overload & Recovery</h2>
            <p>Report any fatigue or discomfort to get a personalized recovery and mobility plan.</p>
            <form onSubmit={handleSubmit} className="onboarding-form">
                 <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="soreMuscles">Sore muscle groups (comma-separated)</label>
                        <input type="text" id="soreMuscles" name="soreMuscles" value={profile.soreMuscles} onChange={handleChange} placeholder="e.g., quads, lower back" disabled={loading} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="achyJoints">Achy joints (comma-separated)</label>
                        <input type="text" id="achyJoints" name="achyJoints" value={profile.achyJoints} onChange={handleChange} placeholder="e.g., knees, shoulders" disabled={loading} />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="sorenessLevel">Overall soreness/discomfort level (1-10)</label>
                    <input type="range" id="sorenessLevel" name="sorenessLevel" min="1" max="10" value={profile.sorenessLevel} onChange={handleChange} disabled={loading} />
                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{profile.sorenessLevel}</div>
                </div>


                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="discomfortType">Type of Discomfort</label>
                        <select id="discomfortType" name="discomfortType" value={profile.discomfortType} onChange={handleChange} disabled={loading}>
                            <option value="dull-ache">Dull Ache</option>
                            <option value="stiffness">Stiffness</option>
                            <option value="tightness">Tightness</option>
                            <option value="sharp-pain">Sharp Pain</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="recentIntensity">Recent Training Intensity</label>
                         <select id="recentIntensity" name="recentIntensity" value={profile.recentIntensity} onChange={handleChange} disabled={loading}>
                            <option value="low">Low</option>
                            <option value="moderate">Moderate</option>
                            <option value="high">High</option>
                            <option value="very-high">Very High / Max Effort</option>
                        </select>
                    </div>
                </div>

                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? <Spinner /> : 'Analyze My Condition'}
                </button>
            </form>
        </div>
    );
};