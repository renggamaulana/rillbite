"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
}

interface MealSlot {
  id: string;
  recipe: Recipe | null;
}

interface DayPlan {
  breakfast: MealSlot;
  lunch: MealSlot;
  dinner: MealSlot;
}

interface WeekPlan {
  [key: string]: DayPlan;
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: { [key: string]: string } = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu"
};

const MEAL_TYPES = [
  { key: "breakfast", label: "Breakfast", emoji: "☕", time: "07:00 - 09:00" },
  { key: "lunch", label: "Lunch", emoji: "🍽️", time: "12:00 - 14:00" },
  { key: "dinner", label: "Dinner", emoji: "🌙", time: "18:00 - 20:00" },
];

export default function DietPlan() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState("monday");
  const [weekPlan, setWeekPlan] = useState<WeekPlan>({});
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize week plan
  useEffect(() => {
    const savedPlan = localStorage.getItem("weekDietPlan");
    if (savedPlan) {
      setWeekPlan(JSON.parse(savedPlan));
    } else {
      initializeWeekPlan();
    }
  }, []);

  const initializeWeekPlan = () => {
    const newPlan: WeekPlan = {};
    DAYS.forEach(day => {
      newPlan[day] = {
        breakfast: { id: `${day}-breakfast`, recipe: null },
        lunch: { id: `${day}-lunch`, recipe: null },
        dinner: { id: `${day}-dinner`, recipe: null },
      };
    });
    setWeekPlan(newPlan);
  };

  const savePlan = () => {
    localStorage.setItem("weekDietPlan", JSON.stringify(weekPlan));
    setIsEditing(false);
    alert("Diet plan saved successfully! ✅");
  };

  const clearPlan = () => {
    if (confirm("Are you sure you want to clear all meals?")) {
      initializeWeekPlan();
      localStorage.removeItem("weekDietPlan");
    }
  };

  const searchRecipes = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/complexSearch`,
        {
          params: {
            query: searchQuery,
            apiKey: process.env.NEXT_PUBLIC_API_KEY,
            number: 12,
            addRecipeInformation: true,
          },
        }
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error searching recipes:", error);
      alert("Failed to search recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addRecipeToMeal = (recipe: Recipe) => {
    if (!selectedMealType) return;

    const newPlan = { ...weekPlan };
    newPlan[selectedDay][selectedMealType as keyof DayPlan].recipe = recipe;
    setWeekPlan(newPlan);
    setShowRecipeModal(false);
    setSearchQuery("");
    setSearchResults([]);
    setIsEditing(true);
  };

  const removeRecipeFromMeal = (mealType: string) => {
    const newPlan = { ...weekPlan };
    newPlan[selectedDay][mealType as keyof DayPlan].recipe = null;
    setWeekPlan(newPlan);
    setIsEditing(true);
  };

  const openRecipeModal = (mealType: string) => {
    setSelectedMealType(mealType);
    setShowRecipeModal(true);
  };

  const currentDayPlan = weekPlan[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Custom Diet Plan
            </h1>
            <p className="text-teal-100 text-lg max-w-2xl mx-auto">
              Create your personalized weekly meal plan by choosing your favorite recipes
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FaEdit />
                {isEditing ? "Cancel Edit" : "Edit Plan"}
              </button>
              {isEditing && (
                <button
                  onClick={savePlan}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FaSave />
                  Save Plan
                </button>
              )}
            </div>
            <button
              onClick={clearPlan}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <FaTrash />
              Clear All
            </button>
          </div>
        </div>

        {/* Day Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  selectedDay === day
                    ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {DAY_LABELS[day]}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Plan Display */}
        {currentDayPlan && (
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {MEAL_TYPES.map((mealType) => {
              const meal = currentDayPlan[mealType.key as keyof DayPlan];
              const recipe = meal?.recipe;

              return (
                <div
                  key={mealType.key}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 border-b border-teal-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{mealType.emoji}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {mealType.label}
                          </h3>
                          <p className="text-sm text-gray-600">{mealType.time}</p>
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => openRecipeModal(mealType.key)}
                          className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <FaPlus />
                          {recipe ? "Change" : "Add Recipe"}
                        </button>
                      )}
                    </div>
                  </div>

                  {recipe ? (
                    <div className="md:flex">
                      <div className="md:w-1/3 relative h-64 md:h-auto">
                        <Image
                          src={recipe.image}
                          alt={recipe.title}
                          fill
                          className="object-cover cursor-pointer"
                          onClick={() => router.push(`/recipes/${recipe.id}`)}
                        />
                      </div>
                      <div className="md:w-2/3 p-6 flex flex-col justify-between">
                        <div>
                          <h4 className="text-2xl font-bold text-gray-800 mb-4">
                            {recipe.title}
                          </h4>
                          <div className="flex gap-4 mb-4">
                            {recipe.readyInMinutes && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-semibold">⏱️</span>
                                {recipe.readyInMinutes} min
                              </div>
                            )}
                            {recipe.servings && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-semibold">🍽️</span>
                                {recipe.servings} servings
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => router.push(`/recipes/${recipe.id}`)}
                            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
                          >
                            View Recipe
                          </button>
                          {isEditing && (
                            <button
                              onClick={() => removeRecipeFromMeal(mealType.key)}
                              className="bg-red-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center gap-2"
                            >
                              <FaTrash />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="text-6xl mb-4">🍽️</div>
                      <p className="text-gray-600 font-semibold mb-2">
                        No recipe selected
                      </p>
                      <p className="text-gray-500 text-sm">
                        Click (Add Recipe) to choose a meal
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Recipe Search Modal */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">Search Recipes</h2>
              <p className="text-teal-100">Find the perfect recipe for your {selectedMealType}</p>
            </div>

            <div className="p-6">
              {/* Search Input */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchRecipes()}
                  placeholder="Search for recipes... (e.g., chicken, salad, pasta)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                  onClick={searchRecipes}
                  disabled={loading}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-[50vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((recipe) => (
                      <div
                        key={recipe.id}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => addRecipeToMeal(recipe)}
                      >
                        <div className="relative h-40">
                          <Image
                            src={recipe.image}
                            alt={recipe.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                            {recipe.title}
                          </h3>
                          <div className="flex gap-3 text-sm text-gray-600">
                            {recipe.readyInMinutes && (
                              <span>⏱️ {recipe.readyInMinutes} min</span>
                            )}
                            {recipe.servings && (
                              <span>🍽️ {recipe.servings} servings</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-600 font-semibold">
                      {loading ? "Searching..." : "Search for recipes to add to your meal plan"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRecipeModal(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="px-6 py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}