"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Image from "next/image";

interface DayMeal {
  id: number;
  slot: number;
  position: number;
  type: string;
  value?: {
    id: number;
    title: string;
    imageType: string;
    servings?: number;
    readyInMinutes?: number;
    sourceUrl?: string;
  };
}

interface WeekPlan {
  week: {
    monday?: { meals: DayMeal[]; nutrients: { calories: number; protein: number; fat: number; carbohydrates: number; } };
    tuesday?: { meals: DayMeal[]; nutrients: { calories: number; protein: number; fat: number; carbohydrates: number; } };
    wednesday?: { meals: DayMeal[]; nutrients: { calories: number; protein: number; fat: number; carbohydrates: number; } };
    thursday?: { meals: DayMeal[]; nutrients: { calories: number; protein: number; fat: number; carbohydrates: number; } };
    friday?: { meals: DayMeal[]; nutrients: { calories: number; protein: number; fat: number; carbohydrates: number; } };
    saturday?: { meals: DayMeal[]; nutrients: { calories: number; protein: number; fat: number; carbohydrates: number; } };
    sunday?: { meals: DayMeal[]; nutrients: { calories: number; protein: number; fat: number; carbohydrates: number; } };
  };
  nutrients?: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
  };
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

const DIET_TYPES = [
  { value: "", label: "Balanced Diet" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "ketogenic", label: "Keto" },
  { value: "paleo", label: "Paleo" },
];

export default function DietPlan() {
  const [weekPlan, setWeekPlan] = useState<WeekPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState("monday");
  const [loading, setLoading] = useState(false);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [diet, setDiet] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchMealPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/mealplans/generate`,
        {
          params: {
            apiKey: process.env.NEXT_PUBLIC_API_KEY,
            timeFrame: "week",
            targetCalories,
            diet: diet || undefined,
          },
        }
      );
      console.log("API Response:", response.data);
      setWeekPlan(response.data);
    } catch (error: any) {
      console.error("Error fetching meal plan:", error);
      setError(error.response?.data?.message || "Failed to fetch meal plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealPlan();
  }, []);

  const currentDayData = weekPlan?.week?.[selectedDay as keyof typeof weekPlan.week];
  const meals = currentDayData?.meals || [];

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
              Your Weekly Diet Plan
            </h1>
            <p className="text-teal-100 text-lg max-w-2xl mx-auto">
              Personalized meal plans designed to help you achieve your health goals
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Calories
              </label>
              <input
                type="number"
                value={targetCalories}
                onChange={(e) => setTargetCalories(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="1000"
                max="4000"
                step="100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Diet Type
              </label>
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {DIET_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchMealPlan}
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Loading..." : "Generate Plan"}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Day Selector */}
        {weekPlan && !loading && (
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
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600" />
          </div>
        )}

        {/* Meal Plan Display */}
        {!loading && weekPlan && currentDayData && (
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Nutrition Summary */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-lg p-6 mb-8 text-white">
              <h3 className="text-xl font-bold mb-4">Daily Nutrition</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="text-2xl font-bold">
                    {currentDayData.nutrients?.calories?.toFixed(0) || "0"}
                  </div>
                  <div className="text-teal-100 text-sm">Calories</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="text-2xl font-bold">
                    {currentDayData.nutrients?.protein?.toFixed(0) || "0"}g
                  </div>
                  <div className="text-teal-100 text-sm">Protein</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="text-2xl font-bold">
                    {currentDayData.nutrients?.carbohydrates?.toFixed(0) || "0"}g
                  </div>
                  <div className="text-teal-100 text-sm">Carbs</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="text-2xl font-bold">
                    {currentDayData.nutrients?.fat?.toFixed(0) || "0"}g
                  </div>
                  <div className="text-teal-100 text-sm">Fat</div>
                </div>
              </div>
            </div>

            {/* Meals */}
            <div className="space-y-6">
              {meals.length > 0 ? (
                meals.map((meal, index) => {
                  const mealInfo = meal.value;
                  if (!mealInfo) return null;

                  const mealLabels = ["Breakfast", "Lunch", "Dinner"];
                  const mealLabel = mealLabels[meal.slot - 1] || "Meal";

                  return (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3 relative h-64 md:h-auto">
                          <Image
                            src={`https://spoonacular.com/recipeImages/${mealInfo.id}-636x393.${mealInfo.imageType}`}
                            alt={mealInfo.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-gray-100 p-3 rounded-xl text-2xl">
                              {meal.slot === 1 ? "☕" : meal.slot === 2 ? "🍽️" : "🌙"}
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 font-semibold">
                                {mealLabel}
                              </div>
                              <h3 className="text-xl font-bold text-gray-800">
                                {mealInfo.title}
                              </h3>
                            </div>
                          </div>
                          <div className="flex gap-4 mb-4">
                            {mealInfo.readyInMinutes && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-semibold">⏱️</span>
                                {mealInfo.readyInMinutes} min
                              </div>
                            )}
                            {mealInfo.servings && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-semibold">🍽️</span>
                                {mealInfo.servings} servings
                              </div>
                            )}
                          </div>
                          {mealInfo.sourceUrl && (
                            <a
                              href={mealInfo.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                              View Recipe
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🍽️</div>
                  <p className="text-xl text-gray-600 font-semibold">
                    No meals available for this day
                  </p>
                  <p className="text-gray-500 mt-2">
                    Try generating a new meal plan
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* No Data State */}
        {!loading && !weekPlan && !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-xl text-gray-600 font-semibold mb-2">
              Ready to start your meal planning?
            </p>
            <p className="text-gray-500">
              Click Generate Plan to create your personalized weekly menu
            </p>
          </div>
        )}
      </div>
    </div>
  );
}