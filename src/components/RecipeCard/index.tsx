import { Recipe } from "@/app/types/Recipe";
import Image from "next/image";

export default function RecipeCard({recipe} : {recipe: Recipe}) {
    return (
        <div className="border rounded shadow-md p-4 hover:shadow-lg transition">
        <Image
          src={recipe.image}
          alt={recipe.title}
          width={500}
          height={500}
          className="w-full h-40 object-cover rounded"
        />
        <h2 className="text-xl font-bold mt-2">{recipe.title}</h2>
      </div>
    );
}