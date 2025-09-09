import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Onboarding } from './Onboarding';
import { WorkoutPlan as WorkoutPlanComponent } from './WorkoutPlan';
import { NutritionOnboarding } from './NutritionOnboarding';
import { NutritionPlan as NutritionPlanComponent } from './NutritionPlan';
import { CircadianOnboarding } from './CircadianOnboarding';
import { CircadianPlan as CircadianPlanComponent } from './CircadianPlan';
import { WearableOnboarding } from './WearableOnboarding';
import { WearableInsights as WearableInsightsComponent } from './WearableInsights';
import { OverloadOnboarding } from './OverloadOnboarding';
import { OverloadAnalysis as OverloadAnalysisComponent } from './OverloadAnalysis';
import { LongevityOnboarding } from './LongevityOnboarding';
import { LongevityReport as LongevityReportComponent } from './LongevityReport';
import { WorkoutPlan as WorkoutPlanType, NutritionPlan as NutritionPlanType, CircadianPlan as CircadianPlanType, WearableInsights as WearableInsightsType, OverloadAnalysis as OverloadAnalysisType, LongevityReport as LongevityReportType } from '../services/gemini';

type ActiveView = 'workout' | 'nutrition' | 'circadian' | 'wearable' | 'overload' | 'longevity';

export const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanType | null>(null);
    const [nutritionPlan, setNutritionPlan] = useState<NutritionPlanType | null>(null);
    const [circadianPlan, setCircadianPlan] = useState<CircadianPlanType | null>(null);
    const [wearableInsights, setWearableInsights] = useState<WearableInsightsType | null>(null);
    const [overloadAnalysis, setOverloadAnalysis] = useState<OverloadAnalysisType | null>(null);
    const [longevityReport, setLongevityReport] = useState<LongevityReportType | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>('workout');

    const handleWorkoutPlanGenerated = (plan: WorkoutPlanType) => {
        setWorkoutPlan(plan);
    };

    const handleResetWorkoutPlan = () => {
        setWorkoutPlan(null);
    }

    const handleNutritionPlanGenerated = (plan: NutritionPlanType) => {
        setNutritionPlan(plan);
    };

    const handleResetNutritionPlan = () => {
        setNutritionPlan(null);
    }

    const handleCircadianPlanGenerated = (plan: CircadianPlanType) => {
        setCircadianPlan(plan);
    };

    const handleResetCircadianPlan = () => {
        setCircadianPlan(null);
    }

    const handleWearableInsightsGenerated = (insights: WearableInsightsType) => {
        setWearableInsights(insights);
    };

    const handleResetWearableInsights = () => {
        setWearableInsights(null);
    }

    const handleOverloadAnalysisGenerated = (analysis: OverloadAnalysisType) => {
        setOverloadAnalysis(analysis);
    };

    const handleResetOverloadAnalysis = () => {
        setOverloadAnalysis(null);
    }

    const handleLongevityReportGenerated = (report: LongevityReportType) => {
        setLongevityReport(report);
    };

    const handleResetLongevityReport = () => {
        setLongevityReport(null);
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

            <div className="dashboard-tabs">
                <button
                    className={`tab-button ${activeView === 'workout' ? 'active' : ''}`}
                    onClick={() => setActiveView('workout')}
                    aria-pressed={activeView === 'workout'}
                >
                    Workout Plan
                </button>
                <button
                    className={`tab-button ${activeView === 'nutrition' ? 'active' : ''}`}
                    onClick={() => setActiveView('nutrition')}
                    aria-pressed={activeView === 'nutrition'}
                >
                    Nutrition Plan
                </button>
                <button
                    className={`tab-button ${activeView === 'circadian' ? 'active' : ''}`}
                    onClick={() => setActiveView('circadian')}
                    aria-pressed={activeView === 'circadian'}
                >
                    Circadian Sync
                </button>
                <button
                    className={`tab-button ${activeView === 'wearable' ? 'active' : ''}`}
                    onClick={() => setActiveView('wearable')}
                    aria-pressed={activeView === 'wearable'}
                >
                    Wearable Insights
                </button>
                 <button
                    className={`tab-button ${activeView === 'overload' ? 'active' : ''}`}
                    onClick={() => setActiveView('overload')}
                    aria-pressed={activeView === 'overload'}
                >
                    Overload Prevention
                </button>
                <button
                    className={`tab-button ${activeView === 'longevity' ? 'active' : ''}`}
                    onClick={() => setActiveView('longevity')}
                    aria-pressed={activeView === 'longevity'}
                >
                    Longevity Report
                </button>
            </div>

            <main className="dashboard-content">
                {activeView === 'workout' && (
                    workoutPlan ? (
                        <WorkoutPlanComponent plan={workoutPlan} onReset={handleResetWorkoutPlan} />
                    ) : (
                        <Onboarding onPlanGenerated={handleWorkoutPlanGenerated} />
                    )
                )}

                {activeView === 'nutrition' && (
                    nutritionPlan ? (
                        <NutritionPlanComponent plan={nutritionPlan} onReset={handleResetNutritionPlan} />
                    ) : (
                        <NutritionOnboarding onPlanGenerated={handleNutritionPlanGenerated} />
                    )
                )}

                {activeView === 'circadian' && (
                    circadianPlan ? (
                        <CircadianPlanComponent plan={circadianPlan} onReset={handleResetCircadianPlan} />
                    ) : (
                        <CircadianOnboarding onPlanGenerated={handleCircadianPlanGenerated} />
                    )
                )}

                {activeView === 'wearable' && (
                    wearableInsights ? (
                        <WearableInsightsComponent insights={wearableInsights} onReset={handleResetWearableInsights} />
                    ) : (
                        <WearableOnboarding onInsightsGenerated={handleWearableInsightsGenerated} />
                    )
                )}

                {activeView === 'overload' && (
                    overloadAnalysis ? (
                        <OverloadAnalysisComponent analysis={overloadAnalysis} onReset={handleResetOverloadAnalysis} />
                    ) : (
                        <OverloadOnboarding onAnalysisGenerated={handleOverloadAnalysisGenerated} />
                    )
                )}

                {activeView === 'longevity' && (
                    longevityReport ? (
                        <LongevityReportComponent report={longevityReport} onReset={handleResetLongevityReport} />
                    ) : (
                        <LongevityOnboarding onReportGenerated={handleLongevityReportGenerated} />
                    )
                )}
            </main>
        </div>
    );
};
