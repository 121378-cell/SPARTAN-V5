// Implemented Gemini service to resolve module loading errors and provide workout generation functionality.
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- WORKOUT ---
export interface WorkoutPlan {
  planName: string;
  durationWeeks: number;
  days: {
    day: number;
    name: string;
    exercises: {
      name: string;
      sets: string;
      reps: string;
      rest: string;
    }[];
  }[];
}

export interface UserProfile {
  goal: string;
  level: string;
  daysPerWeek: string;
  equipment: string;
}

// --- NUTRITION ---
export interface Meal {
    name: string;
    items: string[];
}
export interface NutritionPlan {
  planName: string;
  dailyCalories: number;
  macronutrients: {
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
  days: {
    day: string; // e.g., "Monday"
    meals: Meal[];
  }[];
}

export interface NutritionProfile {
    goal: string;
    diet: string;
    allergies: string;
    dislikedFoods: string;
    mealsPerDay: string;
}

// --- RECIPE ---
export interface Recipe {
    recipeName: string;
    ingredients: {
        name: string;
        quantity: string;
    }[];
    instructions: string[];
    substitutions: {
        original: string;
        substitute: string;
    }[];
}

// --- CIRCADIAN ---
export interface CircadianProfile {
    wakeTime: string;
    sleepTime: string;
    activityWindow: string;
    sleepIssues: string;
}

export interface CircadianPlan {
    planName: string;
    idealSleepSchedule: {
        bedtime: string;
        wakeupTime: string;
    };
    dailyTiming: {
        time: string;
        name: string;
        description: string;
    }[];
    sleepHygieneTips: string[];
}

// --- WEARABLE ---
export interface WearableData {
    device: string;
    sleepDuration: string;
    restingHr: string;
    hrv: string;
    steps: string;
    calories: string;
    recoveryStatus: string;
}

export interface WearableInsights {
    planName: string;
    overallStatus: string;
    sleepRecommendation: string;
    activityRecommendation: string;
    recoveryRecommendation: string;
}

// --- OVERLOAD ---
export interface OverloadProfile {
    soreMuscles: string;
    achyJoints: string;
    sorenessLevel: string;
    discomfortType: string;
    recentIntensity: string;
}

export interface OverloadAnalysis {
    analysisTitle: string;
    riskLevel: 'Low' | 'Moderate' | 'High';
    summary: string;
    identifiedAreas: {
        area: string;
        notes: string;
    }[];
    correctiveActions: {
        name: string;
        type: 'Mobility' | 'Corrective Exercise' | 'Recovery Protocol';
        description: string;
    }[];
}

// --- LONGEVITY ---
export interface LongevityProfile {
    bodyweight: string;
    bodyFatPercentage: string;
    squatMax: string;
    benchMax: string;
    deadliftMax: string;
    avgSleepDuration: string;
    sleepQuality: string;
    vo2Max: string;
}

export interface LongevityReport {
    reportTitle: string;
    longevityScore: number;
    weeklySummary: string;
    relativeStrength: {
        analysis: string;
    };
    bodyComposition: {
        analysis: string;
    };
    sleepQuality: {
        analysis: string;
    };
    cardiovascularFitness: {
        analysis: string;
    };
    actionableRecommendations: string[];
}


export const generateWorkoutPlan = async (profile: UserProfile): Promise<WorkoutPlan> => {
  const prompt = `
    Create a personalized workout plan based on the following user profile. The response MUST be in JSON format.
    - Fitness Goal: ${profile.goal}
    - Experience Level: ${profile.level}
    - Days per week: ${profile.daysPerWeek}
    - Available Equipment: ${profile.equipment}

    The plan should be for 4 weeks. Structure the response according to the provided JSON schema. Provide a catchy name for the plan.
    For sets, reps, and rest, provide concrete numbers or ranges (e.g., "3-4", "8-12", "60-90 seconds").
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      planName: { type: Type.STRING, description: "A catchy name for the workout plan." },
      durationWeeks: { type: Type.INTEGER, description: "The duration of the plan in weeks." },
      days: {
        type: Type.ARRAY,
        description: "An array of workout days for one week.",
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.INTEGER, description: "The day number of the week (e.g., 1)." },
            name: { type: Type.STRING, description: "The focus of the day (e.g., 'Upper Body Strength', 'Rest')." },
            exercises: {
              type: Type.ARRAY,
              description: "List of exercises for the day. Should be empty if it's a rest day.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.STRING },
                  reps: { type: Type.STRING },
                  rest: { type: Type.STRING, description: "Rest time between sets." },
                },
                required: ["name", "sets", "reps", "rest"]
              }
            }
          },
          required: ["day", "name", "exercises"]
        }
      }
    },
    required: ["planName", "durationWeeks", "days"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const plan: WorkoutPlan = JSON.parse(jsonText);
    return plan;
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw new Error("Failed to generate workout plan. Please try again.");
  }
};

export const generateNutritionPlan = async (profile: NutritionProfile): Promise<NutritionPlan> => {
    const prompt = `
        Create a personalized 7-day nutrition plan based on the user's profile. The response MUST be in JSON format.
        - Primary Goal: ${profile.goal}
        - Dietary Preference: ${profile.diet}
        - Allergies or Restrictions: ${profile.allergies || 'None'}
        - Disliked Foods: ${profile.dislikedFoods || 'None'}
        - Meals per day: ${profile.mealsPerDay}

        The plan should include a catchy name, estimated daily calories, and macronutrient targets (protein, carbs, fat).
        For each of the 7 days (Monday to Sunday), provide a list of meals (${profile.mealsPerDay} meals per day).
        For each meal, list 1-3 food items with estimated quantities (e.g., "Grilled Chicken Breast (150g)").
        Ensure the plan is varied, balanced, and aligned with the user's goal and preferences. Avoid all disliked foods and allergens.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            planName: { type: Type.STRING, description: "A catchy name for the nutrition plan." },
            dailyCalories: { type: Type.INTEGER, description: "Estimated daily calorie target." },
            macronutrients: {
                type: Type.OBJECT,
                properties: {
                    proteinGrams: { type: Type.INTEGER },
                    carbsGrams: { type: Type.INTEGER },
                    fatGrams: { type: Type.INTEGER },
                },
                required: ["proteinGrams", "carbsGrams", "fatGrams"]
            },
            days: {
                type: Type.ARRAY,
                description: "A 7-day meal plan.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: { type: Type.STRING, description: "Day of the week (e.g., 'Monday')." },
                        meals: {
                            type: Type.ARRAY,
                            description: "List of meals for the day.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "Name of the meal (e.g., 'Breakfast', 'Lunch')." },
                                    items: { type: Type.ARRAY, items: { type: Type.STRING } }
                                },
                                required: ["name", "items"]
                            }
                        }
                    },
                    required: ["day", "meals"]
                }
            }
        },
        required: ["planName", "dailyCalories", "macronutrients", "days"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        const jsonText = response.text.trim();
        const plan: NutritionPlan = JSON.parse(jsonText);
        return plan;
    } catch (error) {
        console.error("Error generating nutrition plan:", error);
        throw new Error("Failed to generate nutrition plan. The model may be unable to create a plan with the specified restrictions. Please try again with different options.");
    }
};

export const generateRecipe = async (meal: Meal, planContext: NutritionPlan): Promise<Recipe> => {
    const prompt = `
        Create a simple recipe for a meal called "${meal.name}" that includes the following items: ${meal.items.join(', ')}.
        This recipe is part of a larger nutrition plan with the goal of "${planContext.planName}" and daily targets of approximately ${planContext.dailyCalories} calories, ${planContext.macronutrients.proteinGrams}g protein, ${planContext.macronutrients.carbsGrams}g carbs, and ${planContext.macronutrients.fatGrams}g fat.
        
        Please provide the following in a JSON response:
        1. A creative name for the recipe.
        2. A list of ingredients with specific quantities.
        3. Step-by-step cooking instructions.
        4. A few sensible ingredient substitution options (e.g., "Chicken breast" can be substituted with "Turkey breast or firm tofu").
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            recipeName: { type: Type.STRING },
            ingredients: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        quantity: { type: Type.STRING },
                    },
                    required: ["name", "quantity"],
                },
            },
            instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
            },
            substitutions: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        original: { type: Type.STRING },
                        substitute: { type: Type.STRING },
                    },
                    required: ["original", "substitute"],
                },
            },
        },
        required: ["recipeName", "ingredients", "instructions"],
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating recipe:", error);
        throw new Error("Failed to generate the recipe. Please try again.");
    }
};

export const generateCircadianPlan = async (profile: CircadianProfile): Promise<CircadianPlan> => {
    const prompt = `
        Create a synchronized diet and sleep plan based on the user's circadian rhythm to optimize recovery and performance. The response MUST be in JSON format.
        User Profile:
        - Typical Wake-up Time: ${profile.wakeTime}
        - Typical Bedtime: ${profile.sleepTime}
        - Primary Activity/Workout Window: ${profile.activityWindow}
        - Sleep Challenges: ${profile.sleepIssues || 'None'}

        The plan should include:
        1.  A catchy name for the plan.
        2.  An ideal, recommended sleep schedule (bedtime and wake-up time).
        3.  A detailed daily timeline of events from waking up to sleeping. This should include specific times for:
            - Hydration and morning sunlight exposure.
            - Meal times (e.g., Breakfast, Lunch, Dinner) that align with a healthy eating window.
            - The optimal workout time based on their activity window.
            - A "wind-down" period before bed.
            - Other relevant activities like a coffee cut-off time.
        4.  A list of actionable sleep hygiene tips, especially addressing the user's sleep challenges.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            planName: { type: Type.STRING },
            idealSleepSchedule: {
                type: Type.OBJECT,
                properties: {
                    bedtime: { type: Type.STRING },
                    wakeupTime: { type: Type.STRING },
                },
                required: ["bedtime", "wakeupTime"],
            },
            dailyTiming: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        time: { type: Type.STRING, description: "e.g., 7:00 AM" },
                        name: { type: Type.STRING, description: "e.g., Wake-up & Hydrate" },
                        description: { type: Type.STRING, description: "A brief recommendation for this time block." },
                    },
                    required: ["time", "name", "description"],
                },
            },
            sleepHygieneTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
            },
        },
        required: ["planName", "idealSleepSchedule", "dailyTiming", "sleepHygieneTips"],
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating circadian plan:", error);
        throw new Error("Failed to generate the circadian plan. Please try again.");
    }
};

export const generateWearableInsights = async (data: WearableData): Promise<WearableInsights> => {
    const prompt = `
      Act as an elite performance and recovery coach. Analyze the following daily biometric data from a user's wearable device (${data.device}) and provide holistic, actionable insights. The response MUST be in JSON format.

      User's Data for Today:
      - Sleep Duration: ${data.sleepDuration}
      - Resting Heart Rate: ${data.restingHr} bpm
      - Heart Rate Variability (HRV): ${data.hrv} ms
      - Steps: ${data.steps}
      - Calories Burned: ${data.calories} kcal
      - Device-Reported Recovery Status: ${data.recoveryStatus}

      Based on this data, provide the following:
      1.  'planName': A title for today's insight, like "Today's Biometric Analysis".
      2.  'overallStatus': A brief, one-sentence summary of the user's readiness for the day. (e.g., "Primed for a high-intensity day," or "Focus on active recovery today.")
      3.  'sleepRecommendation': Analyze the sleep duration. Provide a specific recommendation. If sleep is good, commend it. If it's low, suggest a tangible action for tonight (e.g., "Your sleep was a bit short. Aim for a 30-minute wind-down routine tonight, avoiding screens.").
      4.  'activityRecommendation': Analyze steps and calories in the context of recovery. If recovery is good, suggest a challenging workout. If recovery is poor, suggest lighter activity (e.g., "Your recovery is excellent. This is a great day to push hard in your scheduled workout." or "Given your low recovery, consider swapping your intense workout for a 30-minute walk or light yoga.").
      5.  'recoveryRecommendation': Analyze Resting HR and HRV. Explain what they indicate in simple terms and provide a recovery-focused tip. (e.g., "Your HRV is strong, indicating your nervous system is well-recovered. A 5-minute session of box breathing post-workout could enhance this further." or "Your resting heart rate is slightly elevated, suggesting some lingering fatigue. Prioritize hydration and consider a relaxing activity like reading before bed.").
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            planName: { type: Type.STRING },
            overallStatus: { type: Type.STRING },
            sleepRecommendation: { type: Type.STRING },
            activityRecommendation: { type: Type.STRING },
            recoveryRecommendation: { type: Type.STRING },
        },
        required: ["planName", "overallStatus", "sleepRecommendation", "activityRecommendation", "recoveryRecommendation"],
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating wearable insights:", error);
        throw new Error("Failed to analyze wearable data. Please try again.");
    }
};

export const generateOverloadAnalysis = async (profile: OverloadProfile): Promise<OverloadAnalysis> => {
    const prompt = `
      Act as an expert physical therapist and sports scientist. Analyze the user's self-reported data to detect potential accumulated overload in joints and muscles. Provide a risk assessment and suggest actionable corrective exercises, mobility work, or active deloading. The response MUST be in JSON format.

      User's Self-Report:
      - Sore Muscle Groups: ${profile.soreMuscles || 'None reported'}
      - Achy Joints: ${profile.achyJoints || 'None reported'}
      - Soreness/Discomfort Level (1-10): ${profile.sorenessLevel}
      - Type of Discomfort: ${profile.discomfortType}
      - Recent Training Intensity: ${profile.recentIntensity}

      Based on this data, provide the following:
      1.  'analysisTitle': "Overload & Recovery Analysis".
      2.  'riskLevel': Categorize the risk of overtraining/injury as 'Low', 'Moderate', or 'High'.
      3.  'summary': A brief, one or two-sentence summary explaining the risk level based on the user's input.
      4.  'identifiedAreas': An array of objects detailing the problem areas. For each area (e.g., "Lower Back", "Knees"), provide brief 'notes' on why it might be an issue.
      5.  'correctiveActions': An array of 2-4 actionable recommendations. For each action, specify its 'name', 'type' ('Mobility', 'Corrective Exercise', or 'Recovery Protocol'), and a clear 'description' of how to perform it or what it entails.
      
      IMPORTANT: If the user reports sharp pain or a high soreness level (8+), prioritize safety in the summary and suggest consulting a healthcare professional. Focus recommendations on gentle mobility and recovery, not strenuous exercises.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            analysisTitle: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
            summary: { type: Type.STRING },
            identifiedAreas: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        area: { type: Type.STRING },
                        notes: { type: Type.STRING },
                    },
                    required: ['area', 'notes'],
                },
            },
            correctiveActions: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['Mobility', 'Corrective Exercise', 'Recovery Protocol'] },
                        description: { type: Type.STRING },
                    },
                    required: ['name', 'type', 'description'],
                },
            },
        },
        required: ['analysisTitle', 'riskLevel', 'summary', 'identifiedAreas', 'correctiveActions'],
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating overload analysis:", error);
        throw new Error("Failed to generate overload analysis. Please try again.");
    }
};

export const generateLongevityReport = async (profile: LongevityProfile): Promise<LongevityReport> => {
    const prompt = `
        Act as a preventative medicine physician and longevity expert. Analyze the user's weekly health metrics to generate a comprehensive "Longevity Report". The response MUST be in JSON format.

        User's Weekly Metrics:
        - Bodyweight: ${profile.bodyweight} kg
        - Body Fat Percentage: ${profile.bodyFatPercentage || 'Not provided'}%
        - 1-Rep Max (Strength): Squat ${profile.squatMax} kg, Bench Press ${profile.benchMax} kg, Deadlift ${profile.deadliftMax} kg
        - Average Sleep Duration: ${profile.avgSleepDuration} per night
        - Subjective Sleep Quality: ${profile.sleepQuality}
        - Estimated VO2 Max: ${profile.vo2Max} mL/kg/min

        Based on these metrics, provide the following:
        1.  'reportTitle': "Weekly Longevity Report".
        2.  'longevityScore': An overall score out of 100, holistically assessing all provided metrics as they relate to long-term health. A higher score reflects better alignment with longevity principles.
        3.  'weeklySummary': A 2-3 sentence summary of the user's week, highlighting strengths and key areas for improvement.
        4.  'relativeStrength': An 'analysis' of their strength relative to bodyweight. Comment on its importance for maintaining muscle mass and metabolic health with age.
        5.  'bodyComposition': An 'analysis' of their bodyweight and body fat percentage. Explain the relevance of maintaining a healthy body composition for reducing chronic disease risk.
        6.  'sleepQuality': An 'analysis' of their sleep duration and quality, linking it to cellular repair, cognitive function, and hormonal balance.
        7.  'cardiovascularFitness': An 'analysis' of their VO2 Max as a key predictor of all-cause mortality. Provide context for their number (e.g., "excellent for your age," "room for improvement").
        8.  'actionableRecommendations': A list of 3-4 specific, actionable recommendations for the upcoming week to improve their next longevity score.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            reportTitle: { type: Type.STRING },
            longevityScore: { type: Type.INTEGER },
            weeklySummary: { type: Type.STRING },
            relativeStrength: {
                type: Type.OBJECT,
                properties: { analysis: { type: Type.STRING } },
                required: ['analysis'],
            },
            bodyComposition: {
                type: Type.OBJECT,
                properties: { analysis: { type: Type.STRING } },
                required: ['analysis'],
            },
            sleepQuality: {
                type: Type.OBJECT,
                properties: { analysis: { type: Type.STRING } },
                required: ['analysis'],
            },
            cardiovascularFitness: {
                type: Type.OBJECT,
                properties: { analysis: { type: Type.STRING } },
                required: ['analysis'],
            },
            actionableRecommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
            },
        },
        required: ['reportTitle', 'longevityScore', 'weeklySummary', 'relativeStrength', 'bodyComposition', 'sleepQuality', 'cardiovascularFitness', 'actionableRecommendations'],
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating longevity report:", error);
        throw new Error("Failed to generate longevity report. Please try again.");
    }
};
