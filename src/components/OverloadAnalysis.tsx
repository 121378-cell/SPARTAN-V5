import React from 'react';
import { OverloadAnalysis as OverloadAnalysisType } from '../services/gemini';

interface OverloadAnalysisProps {
    analysis: OverloadAnalysisType;
    onReset: () => void;
}

export const OverloadAnalysis = ({ analysis, onReset }: OverloadAnalysisProps) => {

    const getRiskLevelClass = (level: 'Low' | 'Moderate' | 'High') => {
        switch (level) {
            case 'Low': return 'risk-level-low';
            case 'Moderate': return 'risk-level-moderate';
            case 'High': return 'risk-level-high';
            default: return '';
        }
    };

    return (
        <div className="overload-analysis-container">
            <div className="plan-header">
                <h2>{analysis.analysisTitle}</h2>
                <button onClick={onReset} className="secondary-button">Generate New Analysis</button>
            </div>

            <div className="analysis-summary">
                <span className={`risk-level-badge ${getRiskLevelClass(analysis.riskLevel)}`}>
                    Risk Level: {analysis.riskLevel}
                </span>
                <p>{analysis.summary}</p>
            </div>

            {analysis.identifiedAreas.length > 0 && (
                <div className="analysis-section">
                    <h3>Identified Areas</h3>
                    <div className="identified-areas-grid">
                        {analysis.identifiedAreas.map((area, index) => (
                            <div key={index} className="area-card">
                                <h4>{area.area}</h4>
                                <p>{area.notes}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="analysis-section">
                <h3>Corrective Action Plan</h3>
                <div className="corrective-actions-grid">
                    {analysis.correctiveActions.map((action, index) => (
                        <div key={index} className="action-card">
                            <div className="action-card-header">
                                <h4>{action.name}</h4>
                                <span className="action-card-type">{action.type}</span>
                            </div>
                            <p>{action.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
