import React, { useState } from 'react';
import { generateWearableInsights, WearableData, WearableInsights } from '../services/gemini';
import { Spinner } from './Spinner';

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
            <h2>Analyze Your Wearable Data</h2>
            <p>Enter today's metrics from your device to get personalized AI-powered insights.</p>
            <form onSubmit={handleSubmit} className="wearable-form">
                <div className="form-group">
                    <label htmlFor="device">What device are you using?</label>
                    <select id="device" name="device" value={data.device} onChange={handleChange} disabled={loading}>
                        <option value="garmin">Garmin</option>
                        <option value="apple-watch">Apple Watch</option>
                        <option value="fitbit">Fitbit</option>
                        <option value="oura">Oura Ring</option>
                        <option value="whoop">Whoop</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="sleepDuration">Sleep Duration</label>
                        <input type="text" id="sleepDuration" name="sleepDuration" value={data.sleepDuration} onChange={handleChange} placeholder="e.g., 8h 15m" required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="recoveryStatus">Recovery Status</label>
                        <select id="recoveryStatus" name="recoveryStatus" value={data.recoveryStatus} onChange={handleChange} disabled={loading}>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="restingHr">Resting HR (bpm)</label>
                        <input type="number" id="restingHr" name="restingHr" value={data.restingHr} onChange={handleChange} placeholder="e.g., 55" required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hrv">HRV (ms)</label>
                        <input type="number" id="hrv" name="hrv" value={data.hrv} onChange={handleChange} placeholder="e.g., 65" required disabled={loading} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="steps">Steps</label>
                        <input type="number" id="steps" name="steps" value={data.steps} onChange={handleChange} placeholder="e.g., 10000" required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="calories">Calories Burned (kcal)</label>
                        <input type="number" id="calories" name="calories" value={data.calories} onChange={handleChange} placeholder="e.g., 2500" required disabled={loading} />
                    </div>
                </div>


                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? <Spinner /> : 'Analyze My Data'}
                </button>
            </form>
        </div>
    );
};
