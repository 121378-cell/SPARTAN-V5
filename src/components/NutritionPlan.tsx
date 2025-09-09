import React, { useState } from 'react';
import { NutritionPlan as NutritionPlanType, Meal, Recipe as RecipeType, generateRecipe } from '../services/gemini.ts';
import { RecipeModal } from './RecipeModal.tsx';

interface NutritionPlanProps {
    plan: NutritionPlanType;
    onReset: () => void;
}

export const NutritionPlan = ({ plan, onReset }: NutritionPlanProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null);
    const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
    const [recipeError, setRecipeError] = useState('');

    const handleViewRecipe = async (meal: Meal) => {
        setIsModalOpen(true);
        setIsLoadingRecipe(true);
        setRecipeError('');
        setSelectedRecipe(null);
        try {
            const recipe = await generateRecipe(meal, plan);
            setSelectedRecipe(recipe);
        } catch (error: any) {
            setRecipeError(error.message || 'Failed to generate recipe.');
        } finally {
            setIsLoadingRecipe(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecipe(null);
        setRecipeError('');
    };

    return (
        <div className="nutrition-plan-container">
            <div className="plan-header">
                <h2>{plan.planName}</h2>
                <button onClick={onReset} className="secondary-button">Generate New Plan</button>
            </div>

            <div className="nutrition-summary">
                <h4>Daily Goal: ~{plan.dailyCalories} kcal</h4>
                <div className="macros">
                    <div className="macro-item">Protein: <span>{plan.macronutrients.proteinGrams}g</span></div>
                    <div className="macro-item">Carbs: <span>{plan.macronutrients.carbsGrams}g</span></div>
                    <div className="macro-item">Fat: <span>{plan.macronutrients.fatGrams}g</span></div>
                </div>
            </div>

            <div className="nutrition-grid">
                {plan.days.map((day) => (
                    <div key={day.day} className="nutrition-day-card">
                        <h3>{day.day}</h3>
                        {day.meals.map((meal) => (
                            <div key={meal.name} className="meal">
                                <div className="meal-header">
                                    <h4>{meal.name}</h4>
                                    <button
                                        className="tertiary-button"
                                        onClick={() => handleViewRecipe(meal)}
                                        disabled={isLoadingRecipe && !selectedRecipe}
                                    >
                                        View Recipe
                                    </button>
                                </div>
                                <ul>
                                    {meal.items.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <RecipeModal
                    recipe={selectedRecipe}
                    loading={isLoadingRecipe}
                    error={recipeError}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};