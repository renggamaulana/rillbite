import axios from "axios";

export const fetchRecipes = async (category:string) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/complexSearch`, {
            params: {
                query: category,
                apiKey: process.env.NEXT_PUBLIC_API_KEY,
                number:10
            },
        });
        if (response.status !== 200) {
            throw new Error("Failed to fetch recipes");
        }
        console.log(response.data.results);
        return response.data.results;

    } catch(error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }


}