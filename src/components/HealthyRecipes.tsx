import Image from "next/image";
import { SimplifiedRecipe } from "@/types/Recipe";

type HealthyRecipesProps = {
    recipes: SimplifiedRecipe[];
}

export default function HealthyRecipes({recipes}:HealthyRecipesProps) {
    return(
         <div className=" p-5">
            <h2 className="text-3xl font-bold mb-10">Our Healthy Recipes</h2>
            <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {recipes.map((recipe) => {
                        return(
                            <div key={recipe.id} className="flex flex-col gap-5">
                                <div className="">
                                    <Image src={recipe.image} alt="Banner Image" className="w-full h-96 object-cover rounded" width={1000} height={500} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-700">{recipe.name}</h3>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}