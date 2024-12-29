"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { fetchRecipeDetail } from "@/utils/api";

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const getRecipeDetail = async () => {
      try {
        setLoading(true);
        const data = await fetchRecipeDetail(Number(params.id));
        setRecipe(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      getRecipeDetail();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-500">Recipes not found</h1>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4"
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="font-bold">{recipe.readyInMinutes}</p>
                <p className="text-sm">Menit</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="font-bold">{recipe.servings}</p>
                <p className="text-sm">Porsi</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="font-bold">{recipe.healthScore}</p>
                <p className="text-sm">Skor Kesehatan</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="font-bold">{recipe.pricePerServing}</p>
                <p className="text-sm">Harga/Porsi</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc pl-5">
              {recipe.extendedIngredients.map(
                (ingredient: any, index: number) => (
                  <li key={index}>{ingredient.original}</li>
                )
              )}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Cooking instructions</h2>
            <div
              dangerouslySetInnerHTML={{ __html: recipe.instructions }}
              className="prose max-w-none"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
