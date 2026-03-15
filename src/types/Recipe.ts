// ============================================================
// Nutrition
// ============================================================

export interface NutrientItem {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

export interface CaloricBreakdown {
  percentProtein: number;
  percentFat: number;
  percentCarbs: number;
}

export interface WeightPerServing {
  amount: number;
  unit: string;
}

export interface Nutrition {
  nutrients: NutrientItem[];
  properties: unknown[];
  flavonoids: unknown[];
  ingredients: unknown[];
  caloricBreakdown: CaloricBreakdown;
  weightPerServing: WeightPerServing;
}

// ============================================================
// Ingredient
// ============================================================

export interface IngredientMeasure {
  amount: number;
  unitShort: string;
  unitLong: string;
}

export interface Ingredient {
  id: number;
  aisle: string;
  image: string;
  consistency: string;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
  measures: {
    us: IngredientMeasure;
    metric: IngredientMeasure;
  };
}

// ============================================================
// Recipe
// ============================================================

export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  summary?: string;
  readyInMinutes: number;
  servings: number;
  healthScore: number;
  pricePerServing: number;
  instructions?: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  sustainable?: boolean;
  gaps?: string;
  lowFodmap?: boolean;
  ketogenic?: boolean;
  whole30?: boolean;
  sourceUrl?: string;
  aggregateLikes?: number;
  spoonacularScore?: number;
  creditsText?: string;
  sourceName?: string;
  extendedIngredients?: Ingredient[];
  nutrition?: Nutrition | null;
  cuisines?: string[];
  dishTypes?: string[];
  diets?: string[];
  occasions?: string[];
  analyzedInstructions?: unknown[];
  originalId?: number | null;
}

// ============================================================
// SimplifiedRecipe — used by HealthyRecipes and recipe list cards
// ============================================================

export interface SimplifiedRecipe {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  readyInMinutes: number;
  servings: number;
  healthScore: number;
  pricePerServing: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  nutrition?: Nutrition | null;
}

// ============================================================
// Nutrition form payload (for admin forms)
// ============================================================

export interface NutritionFormData {
  calories: string;
  protein: string;
  fat: string;
  carbohydrates: string;
}

export const emptyNutritionForm = (): NutritionFormData => ({
  calories: '',
  protein: '',
  fat: '',
  carbohydrates: '',
});