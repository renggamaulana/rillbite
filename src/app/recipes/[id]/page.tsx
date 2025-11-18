"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchRecipeDetail } from "@/utils/api";
import Image from "next/image";
import { Ingredient, Recipe } from "@/types/Recipe";
import { FaClock, FaUtensils, FaHeart, FaDollarSign, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";

// Component untuk format instructions
function InstructionsFormatter({ instructions }: { instructions: string }) {
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    // Remove HTML tags
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = instructions;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    // Split by periods, numbered lists, or new lines
    let stepsArray = textContent
      .split(/\.\s+|\n+/)
      .map(step => step.trim())
      .filter(step => step.length > 20); // Filter out very short text

    // If no good split found, try to split by common patterns
    if (stepsArray.length <= 1) {
      stepsArray = textContent
        .split(/(?:\d+\.|Step \d+:?)/i)
        .map(step => step.trim())
        .filter(step => step.length > 20);
    }

    setSteps(stepsArray);
  }, [instructions]);

  if (steps.length === 0) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: instructions }}
        className="prose prose-lg max-w-none
          prose-headings:text-gray-800 prose-headings:font-bold
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-li:text-gray-700 prose-li:marker:text-green-600
          prose-strong:text-gray-800
          prose-ol:space-y-4 prose-ul:space-y-3"
      />
    );
  }

  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex gap-4 p-5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-md transition-shadow"
        >
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
              {index + 1}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-800 leading-relaxed">{step}</p>
          </div>
          <div className="flex-shrink-0 flex items-center">
            <FaCheckCircle className="text-gray-300 text-xl hover:text-green-600 cursor-pointer transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const params = useParams();
  const router = useRouter();

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
  }, [params]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Recipe Not Found</h1>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the recipe you're looking for.</p>
          <button
            onClick={() => router.push("/recipes")}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg z-10"
        >
          <FaArrowLeft className="text-gray-800 text-xl" />
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg z-10"
        >
          <FaHeart className={`text-xl ${isFavorite ? "text-red-500" : "text-gray-400"}`} />
        </button>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold text-white mb-4"
            >
              {recipe.title}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-green-100 to-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaClock className="text-2xl text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{recipe.readyInMinutes}</p>
              <p className="text-sm text-gray-600">Minutes</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-teal-100 to-cyan-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaUtensils className="text-2xl text-teal-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{recipe.servings}</p>
              <p className="text-sm text-gray-600">Servings</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-emerald-100 to-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaHeart className="text-2xl text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{recipe.healthScore}</p>
              <p className="text-sm text-gray-600">Health Score</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-lime-100 to-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaDollarSign className="text-2xl text-lime-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">${(recipe.pricePerServing / 100).toFixed(2)}</p>
              <p className="text-sm text-gray-600">Per Serving</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Ingredients */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-50 p-3 rounded-xl">
                    <MdRestaurant className="text-2xl text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Ingredients</h2>
                </div>
                <div className="space-y-3">
                  {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? (
                    recipe.extendedIngredients.map((ingredient: Ingredient, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-green-50 transition-colors"
                      >
                        <div className="bg-green-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-green-600 text-xs font-bold">✓</span>
                        </div>
                        <p className="text-gray-700">{ingredient.original}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No ingredients available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-teal-100 to-cyan-50 p-3 rounded-xl">
                    <FaUtensils className="text-2xl text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Cooking Instructions</h2>
                </div>
                
                {recipe.instructions ? (
                  <InstructionsFormatter instructions={recipe.instructions} />
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-gray-600 font-semibold">No instructions available</p>
                    <p className="text-gray-500 text-sm mt-2">Please check the source for cooking instructions</p>
                  </div>
                )}
              </div>

              {/* Summary Section (if available) */}
              {recipe.summary && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 md:p-8 mt-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Recipe</h2>
                  <div
                    dangerouslySetInnerHTML={{ __html: recipe.summary }}
                    className="prose prose-lg max-w-none
                      prose-p:text-gray-700 prose-p:leading-relaxed
                      prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button
              onClick={() => router.push("/recipes")}
              className="bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-green-500 hover:text-green-600 transition-all"
            >
              ← Back to Recipes
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                isFavorite
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg"
              }`}
            >
              <FaHeart className="inline mr-2" />
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}