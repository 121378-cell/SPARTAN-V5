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
            <h2>Generate Weekly Longevity Report</h2>
            <p>Enter your key metrics from the past week for a detailed health and longevity analysis.</p>
            <form onSubmit={handleSubmit} className="longevity-form">

                <h4>Body Composition</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="bodyweight">Bodyweight (kg)</label>
                        <input type="number" id="bodyweight" name="bodyweight" value={profile.bodyweight} onChange={handleChange} required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bodyFatPercentage">Body Fat % (optional)</label>
                        <input type="number" id="bodyFatPercentage" name="bodyFatPercentage" value={profile.bodyFatPercentage} onChange={handleChange} disabled={loading} />
                    </div>
                </div>

                <h4>Strength (1-Rep Max in kg)</h4>
                <div className="form-row-tri">
                    <div className="form-group">
                        <label htmlFor="squatMax">Squat</label>
                        <input type="number" id="squatMax" name="squatMax" value={profile.squatMax} onChange={handleChange} required disabled={loading} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="benchMax">Bench Press</label>
                        <input type="number" id="benchMax" name="benchMax" value={profile.benchMax} onChange={handleChange} required disabled={loading} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="deadliftMax">Deadlift</label>
                        <input type="number" id="deadliftMax" name="deadliftMax" value={profile.deadliftMax} onChange={handleChange} required disabled={loading} />
                    </div>
                </div>

                <h4>Sleep & Cardio</h4>
                 <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="avgSleepDuration">Avg. Sleep Duration</label>
                        <input type="text" id="avgSleepDuration" name="avgSleepDuration" value={profile.avgSleepDuration} onChange={handleChange} placeholder="e.g., 7h 45m" required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sleepQuality">Subjective Sleep Quality</label>
                        <select id="sleepQuality" name="sleepQuality" value={profile.sleepQuality} onChange={handleChange} disabled={loading}>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                </div>
                 <div className="form-group">
                    <label htmlFor="vo2Max">Estimated VO2 Max (mL/kg/min)</label>
                    <input type="number" id="vo2Max" name="vo2Max" value={profile.vo2Max} onChange={handleChange} required disabled={loading} />
                </div>


                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? <Spinner /> : 'Generate My Report'}
                </button>
            </form>
        </div>
    );
};