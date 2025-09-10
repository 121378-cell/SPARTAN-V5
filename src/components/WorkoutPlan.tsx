// Implemented the WorkoutPlan component to resolve module errors.
import React from 'react';
import { WorkoutPlan as WorkoutPlanType } from '../services/gemini.ts';

interface WorkoutPlanProps {
    plan: WorkoutPlanType;
    onReset: () => void;
}

export const WorkoutPlan = ({ plan, onReset }: WorkoutPlanProps) => {
    return (
        <div className="workout-plan-container">
            <div className="plan-header">
                <h2>{plan.planName}</h2>
                <p>Un plan de {plan.durationWeeks} semanas para ayudarte a alcanzar tus objetivos.</p>
                <button onClick={onReset} className="secondary-button">Generar Nuevo Plan</button>
            </div>

            <div className="plan-grid">
                {plan.days.map((day) => (
                    <div key={day.day} className="day-card">
                        <h3>Día {day.day}: {day.name}</h3>
                        {day.exercises.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Ejercicio</th>
                                        <th>Series</th>
                                        <th>Repeticiones</th>
                                        <th>Descanso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.exercises.map((exercise, index) => (
                                        <tr key={index}>
                                            <td>{exercise.name}</td>
                                            <td>{exercise.sets}</td>
                                            <td>{exercise.reps}</td>
                                            <td>{exercise.rest}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="rest-day">Día de Descanso</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};