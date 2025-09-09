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
            <h2>Sync Your Circadian Rhythm</h2>
            <p>Optimize your day by aligning your activities with your internal clock.</p>
            <form onSubmit={handleSubmit} className="circadian-form">
                <div className="form-group">
                    <label htmlFor="wakeTime">What time do you typically wake up?</label>
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
                    <label htmlFor="sleepTime">What time do you typically go to sleep?</label>
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
                    <label htmlFor="activityWindow">When are you most active or when do you prefer to work out?</label>
                    <select id="activityWindow" name="activityWindow" value={profile.activityWindow} onChange={handleChange} disabled={loading}>
                        <option value="morning">Morning (6am - 10am)</option>
                        <option value="mid-day">Mid-day (10am - 2pm)</option>
                        <option value="afternoon">Afternoon (2pm - 6pm)</option>
                        <option value="evening">Evening (6pm - 9pm)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="sleepIssues">Do you have any specific sleep challenges? (optional)</label>
                    <input
                        type="text"
                        id="sleepIssues"
                        name="sleepIssues"
                        value={profile.sleepIssues}
                        onChange={handleChange}
                        placeholder="e.g., trouble falling asleep, waking up at night"
                        disabled={loading}
                    />
                </div>

                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? <Spinner /> : 'Generate My Circadian Plan'}
                </button>
            </form>
        </div>
    );
};