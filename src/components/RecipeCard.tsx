import { Recipe } from "@/types/Recipe";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaHeart, FaClock } from "react-icons/fa";
import { useState } from "react";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onClick={() => router.push(`/recipes/${recipe.id}`)}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg"
        >
          <FaHeart 
            className={`text-xl transition-colors ${
              isFavorite ? "text-red-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* Quick Info Badge */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
          <FaClock className="text-green-600 text-sm" />
          <span className="text-sm font-semibold text-gray-800">
            {recipe.readyInMinutes || "30"} min
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {recipe.title}
        </h3>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-semibold">⭐</span>
            <span>{recipe.healthScore || "85"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">🍽️</span>
            <span>{recipe.servings || "2"} servings</span>
          </div>
        </div>

        {/* View Recipe Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-green-600 font-semibold flex items-center justify-between group-hover:text-green-700">
            <span>View Recipe</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}