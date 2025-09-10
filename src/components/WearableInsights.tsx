import React from 'react';
import { WearableInsights as WearableInsightsType } from '../services/gemini.ts';

interface WearableInsightsProps {
    insights: WearableInsightsType;
    onReset: () => void;
}

export const WearableInsights = ({ insights, onReset }: WearableInsightsProps) => {
    return (
        <div className="wearable-insights-container">
            <div className="plan-header">
                <h2>{insights.planName}</h2>
                <button onClick={onReset} className="secondary-button">Generar Nuevo Análisis</button>
            </div>

            <div className="insights-summary">
                <p><strong>Perspectiva de Hoy:</strong> {insights.overallStatus}</p>
            </div>

            <div className="insights-grid">
                <div className="insight-card">
                    <div className="insight-card-header">
                        <span role="img" aria-label="Icono de luna">🌙</span>
                        <h4>Sueño</h4>
                    </div>
                    <p className="ai-recommendation">{insights.sleepRecommendation}</p>
                </div>

                <div className="insight-card">
                     <div className="insight-card-header">
                        <span role="img" aria-label="Icono de zapatilla de correr">👟</span>
                        <h4>Actividad</h4>
                    </div>
                    <p className="ai-recommendation">{insights.activityRecommendation}</p>
                </div>

                <div className="insight-card">
                     <div className="insight-card-header">
                        <span role="img" aria-label="Icono de latido del corazón">❤️‍🩹</span>
                        <h4>Recuperación</h4>
                    </div>
                    <p className="ai-recommendation">{insights.recoveryRecommendation}</p>
                </div>
            </div>
        </div>
    );
};