import axios from "axios";

export const fetchRecipes = async (category: string) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/complexSearch`, {
            params: {
                query: category,
                apiKey: process.env.NEXT_PUBLIC_API_KEY,
                number: 12
            },
        });
        if (response.status !== 200) {
            throw new Error("Failed to fetch recipes");
        }
        return response.data.results;
    } catch(error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
};

export const fetchRecipeDetail = async (id: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/${id}/information`,
      {
        params: {
          apiKey: process.env.NEXT_PUBLIC_API_KEY,
          includeNutrition: false,
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch recipe detail");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching recipe detail:", error);
    throw error;
  }
};

// New function for fetching meal plans
export const fetchMealPlan = async (
  targetCalories: number = 2000,
  diet: string = "",
  timeFrame: string = "week"
) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/mealplans/generate`,
      {
        params: {
          apiKey: process.env.NEXT_PUBLIC_API_KEY,
          timeFrame,
          targetCalories,
          diet: diet || undefined,
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch meal plan");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    throw error;
  }
};