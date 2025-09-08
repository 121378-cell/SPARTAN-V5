// Implemented the Dashboard component to resolve module errors.
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Onboarding } from './Onboarding';
import { WorkoutPlan } from './WorkoutPlan';
import { WorkoutPlan as WorkoutPlanType } from '../services/gemini';

export const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanType | null>(null);

    const handlePlanGenerated = (plan: WorkoutPlanType) => {
        setWorkoutPlan(plan);
    };

    const handleResetPlan = () => {
        setWorkoutPlan(null);
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Spartan AI</h1>
                <div className="user-info">
                    <span>Welcome, {currentUser?.displayName || currentUser?.email}</span>
                    <button onClick={logout} className="logout-button">Logout</button>
                </div>
            </header>
            <main className="dashboard-content">
                {workoutPlan ? (
                    <WorkoutPlan plan={workoutPlan} onReset={handleResetPlan} />
                ) : (
                    <Onboarding onPlanGenerated={handlePlanGenerated} />
                )}
            </main>
        </div>
    );
};
