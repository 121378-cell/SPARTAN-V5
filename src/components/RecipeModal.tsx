import React from 'react';
import { Recipe } from '../services/gemini';
import { Spinner } from './Spinner';

interface RecipeModalProps {
    recipe: Recipe | null;
    loading: boolean;
    error: string;
    onClose: () => void;
}

export const RecipeModal = ({ recipe, loading, error, onClose }: RecipeModalProps) => {
    return (
        <div className="recipe-modal-overlay" onClick={onClose}>
            <div className="recipe-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="recipe-modal-header">
                    <h3>{recipe?.recipeName || 'Generating Recipe...'}</h3>
                    <button onClick={onClose} className="recipe-modal-close-button" aria-label="Close recipe">&times;</button>
                </div>
                <div className="recipe-modal-body">
                    {loading && <Spinner />}
                    {error && <p className="form-error">{error}</p>}
                    {recipe && !loading && (
                        <>
                            <div className="recipe-section">
                                <h4>Ingredients</h4>
                                <ul>
                                    {recipe.ingredients.map((ing, index) => (
                                        <li key={index}>
                                            <strong>{ing.name}:</strong> {ing.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="recipe-section">
                                <h4>Instructions</h4>
                                <ol>
                                    {recipe.instructions.map((step, index) => (
                                        <li key={index}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                            {recipe.substitutions && recipe.substitutions.length > 0 && (
                                <div className="recipe-section">
                                    <h4>Substitutions</h4>
                                    <ul>
                                        {recipe.substitutions.map((sub, index) => (
                                            <li key={index}>
                                                <strong>{sub.original}:</strong> Can be replaced with {sub.substitute}.
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};