import React from 'react';
import './TacticalMenu.css';

const tacticalTools = [
    { id: 'workout', label: 'Plan de Entrenamiento', command: 'Mostrar mi plan de entrenamiento' },
    { id: 'nutrition', label: 'Plan de Nutrición', command: 'Mostrar mi plan de nutrición' },
    { id: 'circadian', label: 'Sincronización Circadiana', command: 'Analizar mi ritmo circadiano' },
    { id: 'wearable', label: 'Datos Biométricos', command: 'Mostrar mis datos biométricos' },
    { id: 'overload', label: 'Prevención de Sobrecarga', command: 'Analizar riesgo de sobrecarga' },
    { id: 'longevity', label: 'Reporte de Longevidad', command: 'Generar mi reporte de longevidad' },
    { id: 'injuries', label: 'Lesiones y Limitaciones', command: 'Registrar una lesión o limitación' },
];

interface TacticalMenuProps {
    onCommand: (command: string) => void;
}

export const TacticalMenu: React.FC<TacticalMenuProps> = ({ onCommand }) => {
    return (
        <aside className="tactical-menu">
            <h2 className="menu-title">Arsenal</h2>
            <nav className="menu-nav">
                <ul>
                    {tacticalTools.map(tool => (
                        <li key={tool.id}>
                            <button onClick={() => onCommand(tool.command)}>
                                {tool.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};
