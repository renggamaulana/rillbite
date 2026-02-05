"use client";

import RecipeCard from "@/components/RecipeCard";
import { fetchRecipes } from "@/utils/api";
import { useEffect, useState } from "react";
import { Recipe } from "../../types/Recipe";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

const CATEGORIES = [
  { value: "healthy", label: "Healthy", emoji: "🥗" },
  { value: "chicken", label: "Chicken", emoji: "🍗" },
  { value: "noodle", label: "Noodle", emoji: "🍜" },
  { value: "pasta", label: "Pasta", emoji: "🍝" },
  { value: "fish", label: "Fish", emoji: "🐟" },
  { value: "vegetarian", label: "Vegetarian", emoji: "🥬" },
  { value: "vegan", label: "Vegan", emoji: "🌱" },
  { value: "gluten-free", label: "Gluten Free", emoji: "🌾" },
  { value: "low-carb", label: "Low Carb", emoji: "⚡" },
  { value: "keto", label: "Keto", emoji: "🥑" },
];

export default function Recipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("healthy");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getRecipes = async () => {
          try {
            setLoading(true);
            const data = await fetchRecipes(selectedCategory);
            setRecipes(data);
          } catch (error) {
            console.error("Error fetching recipes:", error);
          } finally {
            setLoading(false);
          }
        };
        getRecipes();
      }, [selectedCategory]);

      const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
      };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      };
    
      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      };

      return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Healthy Recipe Collection
                </h1>
                <p className="text-green-100 text-lg max-w-2xl mx-auto">
                  Explore our curated collection of nutritious and delicious recipes
                </p>
              </motion.div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-lg"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Browse by Category
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.map((category) => (
                  <motion.button
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-full font-semibold transition-all shadow-md ${
                      selectedCategory === category.value
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-2">{category.emoji}</span>
                    {category.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600" />
              </div>
            )}

            {/* Recipes Grid */}
            {!loading && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {recipes.length > 0 ? (
                  recipes.map((recipe) => (
                    <motion.div
                      key={recipe.id}
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                    >
                      <RecipeCard recipe={recipe} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <div className="text-6xl mb-4">🍽️</div>
                    <p className="text-xl text-gray-600 font-semibold">
                      No recipes found for this category
                    </p>
                    <p className="text-gray-500 mt-2">
                      Try selecting a different category
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      );
}