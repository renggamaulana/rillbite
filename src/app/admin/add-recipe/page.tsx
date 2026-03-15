"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserRecipe } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { NutritionFormData, emptyNutritionForm } from "@/types/Recipe";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlus, FaTimes } from "react-icons/fa";
import Link from "next/link";
import NutritionFormSection from "@/components/NutritionFormSection";

// ============================================================
// Types
// ============================================================

interface RecipeFormData {
  title: string;
  summary: string;
  image: string;
  ready_in_minutes: string;
  servings: string;
  health_score: string;
  price_per_serving: string;
  instructions: string;
  vegetarian: boolean;
  vegan: boolean;
  gluten_free: boolean;
  dairy_free: boolean;
}

const initialFormData: RecipeFormData = {
  title: "",
  summary: "",
  image: "",
  ready_in_minutes: "",
  servings: "",
  health_score: "",
  price_per_serving: "",
  instructions: "",
  vegetarian: false,
  vegan: false,
  gluten_free: false,
  dairy_free: false,
};

// ============================================================
// Helpers
// ============================================================

/** Returns true if all 4 nutrition fields are filled */
const hasNutritionData = (n: NutritionFormData): boolean =>
  [n.calories, n.protein, n.fat, n.carbohydrates].every((v) => v.trim() !== "");

// ============================================================
// Page
// ============================================================

export default function AddRecipe() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [categories, setCategories]       = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [formData, setFormData]           = useState<RecipeFormData>(initialFormData);
  const [nutrition, setNutrition]         = useState<NutritionFormData>(emptyNutritionForm());

  // Redirect non-admins
  if (!isAdmin) {
    router.push("/");
    return null;
  }

  // ---- Handlers ----

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNutritionChange = (
    field: keyof NutritionFormData,
    value: string
  ) => {
    setNutrition((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = () => {
    const trimmed = categoryInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setCategories((prev) => prev.filter((c) => c !== category));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        ready_in_minutes: formData.ready_in_minutes
          ? parseInt(formData.ready_in_minutes)
          : undefined,
        servings: formData.servings
          ? parseInt(formData.servings)
          : undefined,
        health_score: formData.health_score
          ? parseFloat(formData.health_score)
          : undefined,
        price_per_serving: formData.price_per_serving
          ? parseFloat(formData.price_per_serving)
          : undefined,
        categories: categories.length > 0 ? categories : undefined,
        // Only attach nutrition if all fields are filled
        nutrition: hasNutritionData(nutrition)
          ? {
              calories:      parseFloat(nutrition.calories),
              protein:       parseFloat(nutrition.protein),
              fat:           parseFloat(nutrition.fat),
              carbohydrates: parseFloat(nutrition.carbohydrates),
            }
          : undefined,
      };

      await createUserRecipe(payload);
      router.push("/recipes");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <FaArrowLeft />
            <span>Back to Recipes</span>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Add New Recipe
          </h1>
          <p className="text-gray-600 mt-2">
            Create a new healthy recipe for the community
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recipe Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Healthy Avocado Toast"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Brief description of the recipe..."
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Numeric fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "ready_in_minutes", label: "Ready in Minutes", placeholder: "30",  type: "number", min: "0" },
              { name: "servings",         label: "Servings",          placeholder: "4",   type: "number", min: "1" },
              { name: "health_score",     label: "Health Score (0-100)", placeholder: "85", type: "number", min: "0", max: "100", step: "0.1" },
              { name: "price_per_serving",label: "Price per Serving ($)", placeholder: "3.50", type: "number", min: "0", step: "0.01" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof RecipeFormData] as string}
                  onChange={handleChange}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categories
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add a category..."
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <FaPlus /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category)}
                    className="hover:text-purple-900"
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Step-by-step cooking instructions..."
            />
          </div>

          {/* ---- NUTRITION SECTION ---- */}
          <NutritionFormSection
            data={nutrition}
            onChange={handleNutritionChange}
          />

          {/* Dietary options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Dietary Options
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "vegetarian", label: "Vegetarian" },
                { name: "vegan",      label: "Vegan" },
                { name: "gluten_free",label: "Gluten Free" },
                { name: "dairy_free", label: "Dairy Free" },
              ].map((option) => (
                <label key={option.name} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={option.name}
                    checked={formData[option.name as keyof RecipeFormData] as boolean}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Recipe"}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}