import { Recipe } from "@/app/types/Recipe";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const router = useRouter();

  return (
    <div
      className="border rounded shadow-md p-4 hover:shadow-lg transition cursor-pointer"
      onClick={() => router.push(`/recipes/${recipe.id}`)}
    >
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
