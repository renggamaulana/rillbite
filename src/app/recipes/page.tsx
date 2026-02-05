"use client";

import RecipeCard from "@/components/RecipeCard";
import { fetchRecipes, searchRecipes } from "@/utils/api";
import { useEffect, useState } from "react";
import { Recipe } from "../../types/Recipe";
import { motion } from "framer-motion";
import { FaSearch, FaTh, FaFilter } from "react-icons/fa";

const CATEGORIES = [
  { value: "all", label: "All Recipes", emoji: "🍽️" },
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

const CUISINES = [
  { value: "", label: "All Cuisines" },
  { value: "italian", label: "Italian" },
  { value: "asian", label: "Asian" },
  { value: "american", label: "American" },
  { value: "mexican", label: "Mexican" },
  { value: "indian", label: "Indian" },
  { value: "mediterranean", label: "Mediterranean" },
];

const COOK_TIME = [
  { value: "", label: "Any Time" },
  { value: "15", label: "Under 15 min" },
  { value: "30", label: "Under 30 min" },
  { value: "60", label: "Under 1 hour" },
];

export default function Recipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCuisine, setSelectedCuisine] = useState<string>("");
    const [maxCookTime, setMaxCookTime] = useState<string>("");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    // Fetch recipes
    useEffect(() => {
        const getRecipes = async () => {
          try {
            setLoading(true);
            
            // If search or advanced filters are active, use complexSearch
            if (searchQuery || selectedCuisine || maxCookTime) {
              const params: any = {
                number: 30,
              };

              if (searchQuery) params.query = searchQuery;
              if (selectedCuisine) params.cuisine = selectedCuisine;
              if (maxCookTime) params.maxReadyTime = maxCookTime;
              
              // Add diet from category if applicable
              if (selectedCategory !== "all") {
                const categoryMap: any = {
                  "vegetarian": "vegetarian",
                  "vegan": "vegan",
                  "gluten-free": "gluten free",
                  "keto": "ketogenic",
                };
                
                if (categoryMap[selectedCategory]) {
                  params.diet = categoryMap[selectedCategory];
                } else {
                  params.query = params.query 
                    ? `${params.query} ${selectedCategory}` 
                    : selectedCategory;
                }
              }

              const data = await searchRecipes(params);
              setRecipes(data.data);
              setTotal(data.total);
            } else {
              // Simple category fetch
              const data = await fetchRecipes(selectedCategory);
              setRecipes(data);
              setTotal(data.length);
            }
          } catch (error) {
            console.error("Error fetching recipes:", error);
            setRecipes([]);
          } finally {
            setLoading(false);
          }
        };
        
        getRecipes();
    }, [selectedCategory, searchQuery, selectedCuisine, maxCookTime]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const clearAllFilters = () => {
        setSelectedCategory("all");
        setSearchQuery("");
        setSelectedCuisine("");
        setMaxCookTime("");
    };

    const hasActiveFilters = selectedCategory !== "all" || searchQuery || selectedCuisine || maxCookTime;

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
                
                {/* Stats */}
                <div className="flex justify-center gap-8 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{total}</div>
                    <div className="text-green-100 text-sm">
                      {hasActiveFilters ? "Results Found" : "Total Recipes"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{CATEGORIES.length - 1}</div>
                    <div className="text-green-100 text-sm">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{recipes.length}</div>
                    <div className="text-green-100 text-sm">Showing</div>
                  </div>
                </div>
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
                  placeholder="Search recipes by name, ingredient, or cuisine..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-32 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-lg"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-xl font-semibold transition-all ${
                    showFilters || selectedCuisine || maxCookTime
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaFilter className="inline mr-2" />
                  Filters
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="max-w-2xl mx-auto mt-4 bg-white p-6 rounded-2xl shadow-lg"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cuisine Type
                      </label>
                      <select
                        value={selectedCuisine}
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {CUISINES.map((cuisine) => (
                          <option key={cuisine.value} value={cuisine.value}>
                            {cuisine.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cooking Time
                      </label>
                      <select
                        value={maxCookTime}
                        onChange={(e) => setMaxCookTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {COOK_TIME.map((time) => (
                          <option key={time.value} value={time.value}>
                            {time.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Categories */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FaTh className="text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Browse by Category
                </h2>
              </div>
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

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-3 justify-center">
                <span className="text-gray-600 font-semibold">Active Filters:</span>
                {selectedCategory !== "all" && (
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                    {CATEGORIES.find(c => c.value === selectedCategory)?.emoji}
                    {CATEGORIES.find(c => c.value === selectedCategory)?.label}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="hover:text-green-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2">
                    🔍 "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:text-blue-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {selectedCuisine && (
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold flex items-center gap-2">
                    🌍 {CUISINES.find(c => c.value === selectedCuisine)?.label}
                    <button
                      onClick={() => setSelectedCuisine("")}
                      className="hover:text-purple-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {maxCookTime && (
                  <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold flex items-center gap-2">
                    ⏱️ {COOK_TIME.find(t => t.value === maxCookTime)?.label}
                    <button
                      onClick={() => setMaxCookTime("")}
                      className="hover:text-orange-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4" />
                <p className="text-gray-600">Loading delicious recipes...</p>
              </div>
            )}

            {/* Recipes Grid */}
            {!loading && (
              <>
                {/* Results Count */}
                <div className="mb-6 text-center">
                  <p className="text-gray-600">
                    Showing <span className="font-bold text-green-600">{recipes.length}</span> recipe{recipes.length !== 1 ? 's' : ''}
                    {total > 0 && recipes.length !== total && (
                      <> out of <span className="font-bold text-green-600">{total}</span> total</>
                    )}
                  </p>
                </div>

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
                      <div className="text-6xl mb-4">🔍</div>
                      <p className="text-xl text-gray-600 font-semibold mb-2">
                        No recipes found
                      </p>
                      <p className="text-gray-500 mb-6">
                        Try adjusting your filters or search term
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </div>
        </div>
    );
}