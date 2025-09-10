import React from 'react';
import { CircadianPlan as CircadianPlanType } from '../services/gemini.ts';

interface CircadianPlanProps {
    plan: CircadianPlanType;
    onReset: () => void;
}

export const CircadianPlan = ({ plan, onReset }: CircadianPlanProps) => {
    return (
        <div className="circadian-plan-container">
            <div className="plan-header">
                <h2>{plan.planName}</h2>
                <p>Un horario diario para alinearse con tu ritmo natural.</p>
                <button onClick={onReset} className="secondary-button">Generar Nuevo Plan</button>
            </div>

            <div className="sleep-schedule">
                <h3>Horario de Sueño Ideal</h3>
                <div className="sleep-times">
                    <div>Hora de dormir: <span>{plan.idealSleepSchedule.bedtime}</span></div>
                    <div>Despertar: <span>{plan.idealSleepSchedule.wakeupTime}</span></div>
                </div>
            </div>

            <div className="circadian-timeline">
                {plan.dailyTiming.map((item, index) => (
                    <div key={index} className="timeline-item">
                        <div className="timeline-time">{item.time}</div>
                        <div className="timeline-content">
                            <h4>{item.name}</h4>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="sleep-tips">
                <h3>Consejos de Higiene del Sueño</h3>
                <ul>
                    {plan.sleepHygieneTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};