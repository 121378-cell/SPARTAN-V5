import React from 'react';
import { WearableInsights as WearableInsightsType } from '../services/gemini';

interface WearableInsightsProps {
    insights: WearableInsightsType;
    onReset: () => void;
}

export const WearableInsights = ({ insights, onReset }: WearableInsightsProps) => {
    return (
        <div className="wearable-insights-container">
            <div className="plan-header">
                <h2>{insights.planName}</h2>
                <button onClick={onReset} className="secondary-button">Generate New Analysis</button>
            </div>

            <div className="insights-summary">
                <p><strong>Today's Outlook:</strong> {insights.overallStatus}</p>
            </div>

            <div className="insights-grid">
                <div className="insight-card">
                    <div className="insight-card-header">
                        <span role="img" aria-label="Moon icon">🌙</span>
                        <h4>Sleep</h4>
                    </div>
                    <p className="ai-recommendation">{insights.sleepRecommendation}</p>
                </div>

                <div className="insight-card">
                     <div className="insight-card-header">
                        <span role="img" aria-label="Running shoe icon">👟</span>
                        <h4>Activity</h4>
                    </div>
                    <p className="ai-recommendation">{insights.activityRecommendation}</p>
                </div>

                <div className="insight-card">
                     <div className="insight-card-header">
                        <span role="img" aria-label="Heartbeat icon">❤️‍🩹</span>
                        <h4>Recovery</h4>
                    </div>
                    <p className="ai-recommendation">{insights.recoveryRecommendation}</p>
                </div>
            </div>
        </div>
    );
};
