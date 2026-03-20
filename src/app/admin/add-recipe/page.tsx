"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserRecipe } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { NutritionFormData, emptyNutritionForm } from "@/types/Recipe";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { FaArrowLeft, FaPlus, FaTimes, FaGripVertical } from "react-icons/fa";
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
  vegetarian: boolean;
  vegan: boolean;
  gluten_free: boolean;
  dairy_free: boolean;
}

interface InstructionStep {
  id: string;
  text: string;
}

interface IngredientRow {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

const initialFormData: RecipeFormData = {
  title: "",
  summary: "",
  image: "",
  ready_in_minutes: "",
  servings: "",
  health_score: "",
  price_per_serving: "",
  vegetarian: false,
  vegan: false,
  gluten_free: false,
  dairy_free: false,
};

const hasNutritionData = (n: NutritionFormData): boolean =>
  [n.calories, n.protein, n.fat, n.carbohydrates].every((v) => v.trim() !== "");

const newStep = (): InstructionStep => ({ id: crypto.randomUUID(), text: "" });

const newIngredient = (): IngredientRow => ({ id: crypto.randomUUID(), name: "", amount: "", unit: "" });

/** Build the "original" string the backend stores, e.g. "2 cup chicken breast" */
const buildOriginal = (ing: IngredientRow): string =>
  [ing.amount, ing.unit, ing.name].filter(Boolean).join(" ").trim();

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
  const [steps, setSteps]                 = useState<InstructionStep[]>([newStep()]);
  const [ingredients, setIngredients]     = useState<IngredientRow[]>([newIngredient()]);

  if (!isAdmin) { router.push("/"); return null; }

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((p) => ({ ...p, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleAddCategory = () => {
    const t = categoryInput.trim();
    if (t && !categories.includes(t)) { setCategories((p) => [...p, t]); setCategoryInput(""); }
  };

  // Step helpers
  const updateStep  = (id: string, text: string) =>
    setSteps((p) => p.map((s) => s.id === id ? { ...s, text } : s));

  const addStepAfter = (id: string) =>
    setSteps((p) => {
      const idx = p.findIndex((s) => s.id === id);
      const next = [...p];
      next.splice(idx + 1, 0, newStep());
      return next;
    });

  const removeStep = (id: string) => {
    if (steps.length === 1) return;
    setSteps((p) => p.filter((s) => s.id !== id));
  };

  // Enter key → insert step below + focus it
  const handleStepKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, id: string) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addStepAfter(id);
      setTimeout(() => {
        const allTextareas = document.querySelectorAll<HTMLTextAreaElement>(".step-textarea");
        const idx = [...allTextareas].findIndex((el) => el.dataset.stepId === id);
        allTextareas[idx + 1]?.focus();
      }, 50);
    }
  };

  const buildInstructions = () =>
    steps.map((s) => s.text.trim()).filter(Boolean).map((t, i) => `${i + 1}. ${t}`).join("\n");

  // Ingredient helpers
  const updateIngredient = (id: string, field: keyof IngredientRow, value: string) =>
    setIngredients((p) => p.map((ing) => ing.id === id ? { ...ing, [field]: value } : ing));

  const addIngredientAfter = (id: string) =>
    setIngredients((p) => {
      const idx = p.findIndex((ing) => ing.id === id);
      const next = [...p];
      next.splice(idx + 1, 0, newIngredient());
      return next;
    });

  const removeIngredient = (id: string) => {
    if (ingredients.length === 1) return;
    setIngredients((p) => p.filter((ing) => ing.id !== id));
  };

  // Tab on name field → focus amount field of same row
  const handleIngredientNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredientAfter(id);
      setTimeout(() => {
        const rows = document.querySelectorAll<HTMLInputElement>(".ingredient-name");
        const idx = [...rows].findIndex((el) => el.dataset.ingId === id);
        rows[idx + 1]?.focus();
      }, 50);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const instructions = buildInstructions();
    if (!instructions) { setError("Please add at least one instruction step."); return; }

    setLoading(true);
    setError("");
    try {
      await createUserRecipe({
        ...formData,
        instructions,
        ready_in_minutes:  formData.ready_in_minutes  ? parseInt(formData.ready_in_minutes)    : undefined,
        servings:          formData.servings           ? parseInt(formData.servings)             : undefined,
        health_score:      formData.health_score       ? parseFloat(formData.health_score)       : undefined,
        price_per_serving: formData.price_per_serving  ? parseFloat(formData.price_per_serving)  : undefined,
        categories:        categories.length > 0       ? categories                              : undefined,
        ingredients: ingredients
          .filter((ing) => ing.name.trim())
          .map((ing) => ({
            name:     ing.name.trim(),
            amount:   ing.amount ? parseFloat(ing.amount) : null,
            unit:     ing.unit.trim(),
            original: buildOriginal(ing),
          })),
        nutrition: hasNutritionData(nutrition)
          ? {
              calories:      parseFloat(nutrition.calories),
              protein:       parseFloat(nutrition.protein),
              fat:           parseFloat(nutrition.fat),
              carbohydrates: parseFloat(nutrition.carbohydrates),
            }
          : undefined,
      });
      router.push("/recipes");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/recipes" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4">
            <FaArrowLeft /><span>Back to Recipes</span>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Add New Recipe
          </h1>
          <p className="text-gray-600 mt-2">Create a new healthy recipe for the community</p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
            >
              <FaTimes className="flex-shrink-0" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Healthy Avocado Toast" />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Summary</label>
            <textarea name="summary" value={formData.summary} onChange={handleChange} rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Brief description of the recipe..." />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg" />
          </div>

          {/* Numeric fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "ready_in_minutes",  label: "Ready in Minutes",     placeholder: "30",   min: "0",  step: "1" },
              { name: "servings",          label: "Servings",             placeholder: "4",    min: "1",  step: "1" },
              { name: "health_score",      label: "Health Score (0-100)", placeholder: "85",   min: "0",  max: "100", step: "0.1" },
              { name: "price_per_serving", label: "Price per Serving ($)",placeholder: "3.50", min: "0",  step: "0.01" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
                <input type="number" name={f.name}
                  value={formData[f.name as keyof RecipeFormData] as string}
                  onChange={handleChange} min={f.min} max={(f as any).max} step={f.step}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Categories</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCategory(); } }}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add a category..." />
              <button type="button" onClick={handleAddCategory}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                <FaPlus /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span key={cat} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                  {cat}
                  <button type="button" onClick={() => setCategories((p) => p.filter((c) => c !== cat))} className="hover:text-purple-900">
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* ── Ingredients ───────────────────────────────────────────────── */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Ingredients</label>
                <p className="text-xs text-gray-400 mt-1">
                  Tulis tiap bahan secara terpisah ·{" "}
                  <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500 font-mono text-[11px]">Enter</kbd>{" "}
                  untuk tambah bahan baru
                </p>
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5">
                {ingredients.filter((i) => i.name.trim()).length}/{ingredients.length} items
              </span>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[1.5rem_1fr_6rem_6rem_1.5rem] gap-2 mb-1.5 px-0.5">
              <div />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ingredient</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Unit</span>
              <div />
            </div>

            <AnimatePresence initial={false}>
              {ingredients.map((ing, index) => (
                <motion.div
                  key={ing.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-[1.5rem_1fr_6rem_6rem_1.5rem] gap-2 mb-2 items-center"
                >
                  {/* Row number */}
                  <span className="text-xs font-bold text-gray-300 text-center">{index + 1}</span>

                  {/* Name */}
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => updateIngredient(ing.id, "name", e.target.value)}
                    onKeyDown={(e) => handleIngredientNameKeyDown(e, ing.id)}
                    data-ing-id={ing.id}
                    className="ingredient-name w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="e.g., Chicken breast"
                  />

                  {/* Amount */}
                  <input
                    type="number"
                    value={ing.amount}
                    onChange={(e) => updateIngredient(ing.id, "amount", e.target.value)}
                    min="0" step="any"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="2"
                  />

                  {/* Unit */}
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(ing.id, "unit", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="cup"
                  />

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeIngredient(ing.id)}
                    disabled={ingredients.length === 1}
                    className="p-1 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-0"
                  >
                    <FaTimes size={12} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setIngredients((p) => [...p, newIngredient()])}
              className="mt-1 flex items-center gap-2 px-4 py-2 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors font-medium"
            >
              <FaPlus size={11} /> Add Ingredient
            </button>

            {/* Preview: shows the "original" string that will be saved */}
            {ingredients.some((i) => i.name.trim()) && (
              <details className="mt-4 group">
                <summary className="text-xs text-gray-400 cursor-pointer select-none hover:text-gray-500 list-none flex items-center gap-1.5 transition-colors">
                  <span className="group-open:rotate-90 transition-transform inline-block text-[10px]">▶</span>
                  Preview "original" field
                </summary>
                <ul className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 font-mono border border-gray-100 space-y-1">
                  {ingredients.filter((i) => i.name.trim()).map((i) => (
                    <li key={i.id}>• {buildOriginal(i)}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>

          {/* ── Instructions Step-by-Step ──────────────────────────────────── */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Cooking Instructions
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Tulis tiap langkah secara terpisah ·{" "}
                  <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500 font-mono text-[11px]">Enter</kbd>{" "}
                  untuk tambah langkah baru · Drag untuk reorder
                </p>
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5">
                {steps.filter((s) => s.text.trim()).length}/{steps.length} steps
              </span>
            </div>

            {/* Reorderable list */}
            <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-2.5 mb-3">
              <AnimatePresence initial={false}>
                {steps.map((step, index) => (
                  <Reorder.Item
                    key={step.id}
                    value={step}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2.5 group"
                  >
                    {/* Drag handle */}
                    <div className="mt-3.5 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 transition-colors flex-shrink-0 touch-none">
                      <FaGripVertical size={13} />
                    </div>

                    {/* Step badge */}
                    <div className="flex-shrink-0 w-7 h-7 mt-2.5 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                      {index + 1}
                    </div>

                    {/* Input */}
                    <textarea
                      value={step.text}
                      onChange={(e) => updateStep(step.id, e.target.value)}
                      onKeyDown={(e) => handleStepKeyDown(e, step.id)}
                      data-step-id={step.id}
                      className="step-textarea flex-1 px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm leading-relaxed transition-shadow"
                      rows={2}
                      placeholder={`Langkah ${index + 1} — misal: Panaskan oven hingga 180°C...`}
                    />

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeStep(step.id)}
                      disabled={steps.length === 1}
                      className="mt-3 p-1.5 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-0 flex-shrink-0"
                    >
                      <FaTimes size={12} />
                    </button>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>

            {/* Add step */}
            <button
              type="button"
              onClick={() => setSteps((p) => [...p, newStep()])}
              className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors font-medium"
            >
              <FaPlus size={11} /> Add Step
            </button>

            {/* Collapsible preview */}
            {steps.some((s) => s.text.trim()) && (
              <details className="mt-4 group">
                <summary className="text-xs text-gray-400 cursor-pointer select-none hover:text-gray-500 list-none flex items-center gap-1.5 transition-colors">
                  <span className="group-open:rotate-90 transition-transform inline-block text-[10px]">▶</span>
                  Preview output
                </summary>
                <pre className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 whitespace-pre-wrap font-mono border border-gray-100 leading-relaxed">
                  {buildInstructions()}
                </pre>
              </details>
            )}
          </div>

          {/* Nutrition */}
          <NutritionFormSection data={nutrition} onChange={(f, v) => setNutrition((p) => ({ ...p, [f]: v }))} />

          {/* Dietary options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Dietary Options</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "vegetarian", label: "Vegetarian" },
                { name: "vegan",      label: "Vegan"      },
                { name: "gluten_free",label: "Gluten Free"},
                { name: "dairy_free", label: "Dairy Free" },
              ].map((opt) => (
                <label key={opt.name} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name={opt.name}
                    checked={formData[opt.name as keyof RecipeFormData] as boolean}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500" />
                  <span className="text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <button type="button" onClick={() => router.back()}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating...
                </span>
              ) : "Create Recipe"}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}