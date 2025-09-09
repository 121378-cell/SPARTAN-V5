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
                <button onClick={onReset} className="secondary-button">Generate New Report</button>
            </div>

            <div className="report-summary-card">
                <div ref={scoreRef} className="longevity-score" role="progressbar" aria-valuenow={report.longevityScore} aria-valuemin={0} aria-valuemax={100}>
                    <span className="longevity-score-value">{report.longevityScore}</span>
                    <span className="longevity-score-label">Score</span>
                </div>
                <div className="summary-text">
                    <p>{report.weeklySummary}</p>
                </div>
            </div>

            <div className="report-grid">
                <div className="metric-card">
                    <h3>💪 Relative Strength</h3>
                    <p className="ai-analysis">{report.relativeStrength.analysis}</p>
                </div>
                 <div className="metric-card">
                    <h3>🧍 Body Composition</h3>
                    <p className="ai-analysis">{report.bodyComposition.analysis}</p>
                </div>
                 <div className="metric-card">
                    <h3>😴 Sleep Quality</h3>
                    <p className="ai-analysis">{report.sleepQuality.analysis}</p>
                </div>
                 <div className="metric-card">
                    <h3>❤️ Cardiovascular Fitness</h3>
                    <p className="ai-analysis">{report.cardiovascularFitness.analysis}</p>
                </div>
            </div>

             <div className="recommendations-section">
                <h3>Action Plan for Next Week</h3>
                <ul className="recommendations-list">
                    {report.actionableRecommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};