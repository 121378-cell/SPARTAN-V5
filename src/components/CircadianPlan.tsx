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
                <p>A daily schedule to align with your natural rhythm.</p>
                <button onClick={onReset} className="secondary-button">Generate New Plan</button>
            </div>

            <div className="sleep-schedule">
                <h3>Ideal Sleep Schedule</h3>
                <div className="sleep-times">
                    <div>Bedtime: <span>{plan.idealSleepSchedule.bedtime}</span></div>
                    <div>Wake up: <span>{plan.idealSleepSchedule.wakeupTime}</span></div>
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
                <h3>Sleep Hygiene Tips</h3>
                <ul>
                    {plan.sleepHygieneTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};