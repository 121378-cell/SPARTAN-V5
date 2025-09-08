// Implemented Gemini service to resolve module loading errors and provide workout generation functionality.
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
