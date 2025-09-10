import React, { useEffect, useRef } from 'react';
import { LongevityReport as LongevityReportType } from '../services/gemini.ts';

interface LongevityReportProps {
    report: LongevityReportType;
    onReset: () => void;
}

export const LongevityReport = ({ report, onReset }: LongevityReportProps) => {
    const scoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animate the score circle
        const timer = setTimeout(() => {
            if (scoreRef.current) {
                scoreRef.current.style.setProperty('--score', `${report.longevityScore}`);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [report.longevityScore]);


    return (
        <div className="longevity-report-container">
            <div className="plan-header">
                <h2>{report.reportTitle}</h2>
                <button onClick={onReset} className="secondary-button">Generar Nuevo Informe</button>
            </div>

            <div className="report-summary-card">
                <div ref={scoreRef} className="longevity-score" role="progressbar" aria-valuenow={report.longevityScore} aria-valuemin={0} aria-valuemax={100}>
                    <span className="longevity-score-value">{report.longevityScore}</span>
                    <span className="longevity-score-label">Puntuación</span>
                </div>
                <div className="summary-text">
                    <p>{report.weeklySummary}</p>
                </div>
            </div>

            <div className="report-grid">
                <div className="metric-card">
                    <h3>💪 Fuerza Relativa</h3>
                    <p className="ai-analysis">{report.relativeStrength.analysis}</p>
                </div>
                 <div className="metric-card">
                    <h3>🧍 Composición Corporal</h3>
                    <p className="ai-analysis">{report.bodyComposition.analysis}</p>
                </div>
                 <div className="metric-card">
                    <h3>😴 Calidad del Sueño</h3>
                    <p className="ai-analysis">{report.sleepQuality.analysis}</p>
                </div>
                 <div className="metric-card">
                    <h3>❤️ Estado Cardiovascular</h3>
                    <p className="ai-analysis">{report.cardiovascularFitness.analysis}</p>
                </div>
            </div>

             <div className="recommendations-section">
                <h3>Plan de Acción para la Próxima Semana</h3>
                <ul className="recommendations-list">
                    {report.actionableRecommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};