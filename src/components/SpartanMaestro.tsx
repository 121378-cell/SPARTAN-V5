import React, { useState, ReactNode } from 'react';
import './SpartanMaestro.css';
import { useAuth } from '../context/AuthContext';
import { TacticalMenu } from './TacticalMenu';
import { Modal } from './Modal';

// Import all components and types from the old Dashboard
import { Onboarding } from './Onboarding.tsx';
import { WorkoutPlan as WorkoutPlanComponent } from './WorkoutPlan.tsx';
import { NutritionOnboarding } from './NutritionOnboarding.tsx';
import { NutritionPlan as NutritionPlanComponent } from './NutritionPlan.tsx';
import { CircadianOnboarding } from './CircadianOnboarding.tsx';
import { CircadianPlan as CircadianPlanComponent } from './CircadianPlan.tsx';
import { WearableOnboarding } from './WearableOnboarding.tsx';
import { WearableInsights as WearableInsightsComponent } from './WearableInsights.tsx';
import { OverloadOnboarding } from './OverloadOnboarding.tsx';
import { OverloadAnalysis as OverloadAnalysisComponent } from './OverloadAnalysis.tsx';
import { LongevityOnboarding } from './LongevityOnboarding.tsx';
import { LongevityReport as LongevityReportComponent } from './LongevityReport.tsx';
import { WorkoutPlan as WorkoutPlanType, NutritionPlan as NutritionPlanType, CircadianPlan as CircadianPlanType, WearableInsights as WearableInsightsType, OverloadAnalysis as OverloadAnalysisType, LongevityReport as LongevityReportType } from '../services/gemini.ts';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'assistant';
}

export const SpartanMaestro = () => {
    const { currentUser, logout } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'Bienvenido a Spartan, Comandante. Estoy listo para recibir tus órdenes.', sender: 'assistant' }
    ]);
    const [inputValue, setInputValue] = useState('');

    // State from Dashboard
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanType | null>(null);
    const [nutritionPlan, setNutritionPlan] = useState<NutritionPlanType | null>(null);
    const [circadianPlan, setCircadianPlan] = useState<CircadianPlanType | null>(null);
    const [wearableInsights, setWearableInsights] = useState<WearableInsightsType | null>(null);
    const [overloadAnalysis, setOverloadAnalysis] = useState<OverloadAnalysisType | null>(null);
    const [longevityReport, setLongevityReport] = useState<LongevityReportType | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<ReactNode>(null);
    const [modalTitle, setModalTitle] = useState('');

    const openModal = (title: string, content: ReactNode) => {
        setModalTitle(title);
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
        setModalTitle('');
    };

    // Handlers from Dashboard
    const handleWorkoutPlanGenerated = (plan: WorkoutPlanType) => {
        setWorkoutPlan(plan);
        closeModal();
    };
    const handleResetWorkoutPlan = () => setWorkoutPlan(null);

    const handleNutritionPlanGenerated = (plan: NutritionPlanType) => {
        setNutritionPlan(plan);
        closeModal();
    };
    const handleResetNutritionPlan = () => setNutritionPlan(null);

    const handleCircadianPlanGenerated = (plan: CircadianPlanType) => {
        setCircadianPlan(plan);
        closeModal();
    };
    const handleResetCircadianPlan = () => setCircadianPlan(null);

    const handleWearableInsightsGenerated = (insights: WearableInsightsType) => {
        setWearableInsights(insights);
        closeModal();
    };
    const handleResetWearableInsights = () => setWearableInsights(null);

    const handleOverloadAnalysisGenerated = (analysis: OverloadAnalysisType) => {
        setOverloadAnalysis(analysis);
        closeModal();
    };
    const handleResetOverloadAnalysis = () => setOverloadAnalysis(null);

    const handleLongevityReportGenerated = (report: LongevityReportType) => {
        setLongevityReport(report);
        closeModal();
    };
    const handleResetLongevityReport = () => setLongevityReport(null);


    const handleCommand = (command: string) => {
        const newId = Date.now();
        const newMessage: Message = { id: newId, text: command, sender: 'user' };
        setMessages(prev => [...prev, newMessage]);

        const lowerCaseCommand = command.toLowerCase();

        if (lowerCaseCommand.includes('entrenamiento')) {
            const content = workoutPlan
                ? <WorkoutPlanComponent plan={workoutPlan} onReset={handleResetWorkoutPlan} />
                : <Onboarding onPlanGenerated={handleWorkoutPlanGenerated} />;
            openModal('Plan de Entrenamiento', content);
        } else if (lowerCaseCommand.includes('nutrición')) {
            const content = nutritionPlan
                ? <NutritionPlanComponent plan={nutritionPlan} onReset={handleResetNutritionPlan} />
                : <NutritionOnboarding onPlanGenerated={handleNutritionPlanGenerated} />;
            openModal('Plan de Nutrición', content);
        } else if (lowerCaseCommand.includes('circadiano')) {
            const content = circadianPlan
                ? <CircadianPlanComponent plan={circadianPlan} onReset={handleResetCircadianPlan} />
                : <CircadianOnboarding onPlanGenerated={handleCircadianPlanGenerated} />;
            openModal('Sincronización Circadiana', content);
        } else if (lowerCaseCommand.includes('biométricos')) {
            const content = wearableInsights
                ? <WearableInsightsComponent insights={wearableInsights} onReset={handleResetWearableInsights} />
                : <WearableOnboarding onInsightsGenerated={handleWearableInsightsGenerated} />;
            openModal('Datos Biométricos', content);
        } else if (lowerCaseCommand.includes('sobrecarga')) {
            const content = overloadAnalysis
                ? <OverloadAnalysisComponent analysis={overloadAnalysis} onReset={handleResetOverloadAnalysis} />
                : <OverloadOnboarding onAnalysisGenerated={handleOverloadAnalysisGenerated} />;
            openModal('Prevención de Sobrecarga', content);
        } else if (lowerCaseCommand.includes('longevidad')) {
            const content = longevityReport
                ? <LongevityReportComponent report={longevityReport} onReset={handleResetLongevityReport} />
                : <LongevityOnboarding onReportGenerated={handleLongevityReportGenerated} />;
            openModal('Reporte de Longevidad', content);
        } else {
            // Placeholder for Gemini response
            const response: Message = { id: newId + 1, text: `Comando "${command}" no reconocido. Estoy aprendiendo. Intenta con "entrenamiento", "nutrición", etc.`, sender: 'assistant' };
            setMessages(prev => [...prev, response]);
        }
    };

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            handleCommand(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="spartan-layout">
            <TacticalMenu onCommand={handleCommand} />
            <div className="maestro-container">
                <header className="maestro-header">
                    <h1>Spartan</h1>
                    <div className="user-info">
                        <span>{currentUser?.displayName || currentUser?.email}</span>
                        <button onClick={logout} className="logout-button">Logout</button>
                    </div>
                </header>
                <main className="chat-area">
                    <div className="messages-container">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message ${msg.sender}`}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                    </div>
                </main>
                <footer className="chat-input-area">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Escribe tu comando..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button className="send-button" onClick={handleSendMessage}>Enviar</button>
                </footer>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>
        </div>
    );
};
