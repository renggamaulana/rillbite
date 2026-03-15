"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchRecipeDetail } from "@/utils/api";
import Image from "next/image";
import { Ingredient, Recipe } from "@/types/Recipe";
import {
  FaClock,
  FaUtensils,
  FaHeart,
  FaDollarSign,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import { toggleFavorite, checkFavorite } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import NutritionCard from "@/components/NutritionCard";

// ============================================================
// InstructionsFormatter
// ============================================================

function InstructionsFormatter({ instructions }: { instructions: string }) {
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = instructions;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    let stepsArray = textContent
      .split(/\.\s+|\n+/)
      .map((step) => step.trim())
      .filter((step) => step.length > 20);

    if (stepsArray.length <= 1) {
      stepsArray = textContent
        .split(/(?:\d+\.|Step \d+:?)/i)
        .map((step) => step.trim())
        .filter((step) => step.length > 20);
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
          transition={{ delay: index * 0.08 }}
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

// ============================================================
// RecipeDetail page
// ============================================================

export default function RecipeDetail() {
  const [recipe, setRecipe]         = useState<Recipe | null>(null);
  const [loading, setLoading]       = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const { isAuthenticated } = useAuth();
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

    if (isAuthenticated) {
      checkFavoriteStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, params.id]);

  const checkFavoriteStatus = async () => {
    try {
      const result = await checkFavorite(Number(params.id));
      setIsFavorite(result.is_favorited);
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    try {
      const result = await toggleFavorite(Number(params.id));
      setIsFavorite(result.is_favorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // ---- Loading ----
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

  // ---- Not found ----
  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Recipe Not Found</h1>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn&apos;t find the recipe you&apos;re looking for.
          </p>
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
      {/* ---- Hero ---- */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg z-10"
        >
          <FaArrowLeft className="text-gray-800 text-xl" />
        </button>

        <button
          onClick={handleFavoriteToggle}
          className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg z-10"
        >
          <FaHeart
            className={`text-xl ${isFavorite ? "text-red-500" : "text-gray-400"}`}
          />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold text-white mb-4"
            >
              {recipe.title}
            </motion.h1>

            {/* Compact nutrition pills in hero */}
            {recipe.nutrition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 mt-3"
              >
                {recipe.nutrition.nutrients.map((n) => (
                  <span
                    key={n.name}
                    className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium"
                  >
                    {n.amount}
                    {n.unit} {n.name}
                  </span>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ---- Content ---- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Quick info cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <FaClock className="text-2xl text-green-600" />, bg: "from-green-100 to-emerald-50", value: recipe.readyInMinutes, label: "Minutes" },
              { icon: <FaUtensils className="text-2xl text-teal-600" />, bg: "from-teal-100 to-cyan-50", value: recipe.servings, label: "Servings" },
              { icon: <FaHeart className="text-2xl text-emerald-600" />, bg: "from-emerald-100 to-green-50", value: recipe.healthScore, label: "Health Score" },
              { icon: <FaDollarSign className="text-2xl text-lime-600" />, bg: "from-lime-100 to-green-50", value: `$${(recipe.pricePerServing / 100).toFixed(2)}`, label: "Per Serving" },
            ].map(({ icon, bg, value, label }, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-br ${bg} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  {icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-600">{label}</p>
              </div>
            ))}
          </div>

          {/* Main content — 3 column layout */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Ingredients */}
            <div className="lg:col-span-1 space-y-6">
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

            {/* Instructions + Nutrition */}
            <div className="lg:col-span-2 space-y-8">
              {/* Instructions */}
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
                    <p className="text-gray-500 text-sm mt-2">
                      Please check the source for cooking instructions
                    </p>
                  </div>
                )}
              </div>

              {/* ---- NUTRITION CARD ---- */}
              {recipe.nutrition ? (
                <NutritionCard nutrition={recipe.nutrition} />
              ) : (
                <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
                  <div className="text-4xl mb-3">🥗</div>
                  <p className="text-gray-500 font-medium">Nutrition data not available</p>
                </div>
              )}

              {/* Summary */}
              {recipe.summary && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 md:p-8">
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

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button
              onClick={() => router.push("/recipes")}
              className="bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-green-500 hover:text-green-600 transition-all"
            >
              ← Back to Recipes
            </button>
            <button
              onClick={handleFavoriteToggle}
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