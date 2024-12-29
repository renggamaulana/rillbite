"use client";

import RecipeCard from "@/components/RecipeCard";
import { fetchRecipes } from "@/utils/api";
import { useEffect, useState } from "react";
import { Recipe } from "../types/Recipe";
import { motion } from "framer-motion";

const CATEGORIES = ["healthy", "chicken", "noodle", "pasta", "fish", "vegetarian", "vegan", "gluten-free", "low-carb", "keto"];


export default function Recipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("healthy");

    useEffect(() => {
        const getRecipes = async () => {
          try {
            const data = await fetchRecipes(selectedCategory);
            setRecipes(data);
          } catch (error) {
            console.error("Error fetching recipes:", error);
          }
        };
        getRecipes();
      }, [selectedCategory]);

      const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
      };

    // Framer motion
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2,
          },
        },
      };
    
      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      };



      return (
        <div>
          <header className="bg-gradient-to-br from-green-400 to-green-600 p-4 text-white text-center">
            <h1 className="text-2xl font-bold">Healthy Food Menu</h1>
          </header>

          <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4 p-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full border hover:bg-green-500 duration-300 hover:text-white ${
                  selectedCategory === category ? "bg-green-500 text-white" : "bg-white text-green-500"
                }`}
              >
                {category.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            >
            {recipes.length > 0 ? (
              recipes.map((recipe) =>
                <motion.div
                    key={recipe.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    >
                    <RecipeCard key={recipe.id} recipe={recipe} />
                </motion.div>)
            ) : (
              <p className="text-center col-span-full text-gray-500">
                No recipes found for this category.
              </p>
            )}
          </motion.div>
        </div>
      );
    
}