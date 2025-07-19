import { StaticImageData } from "next/image";

export interface Ingredient {
  id: number;
  original: string;
}


export interface Recipe {
  id: number;
  name:string;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  healthScore: number;
  pricePerServing: number;
  extendedIngredients: Ingredient[];
  instructions: string;
  summary?: string; // Tambahkan jika ada properti lain yang tidak pasti
}

export interface SimplifiedRecipe {
  id: number;
  name: string;
  image: StaticImageData | string;
}