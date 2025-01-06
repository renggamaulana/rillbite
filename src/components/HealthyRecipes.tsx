import Image from "next/image";
import Link from "next/link";

export default function HealthyRecipes({ recipes }: any) {
  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold">Our Healthy Recipes</h2>
        <Link href="/recipes">
          <button className="border border-gray-300 rounded px-4 py-2 hover:bg-green-500 hover:text-white duration-300">
            See More
          </button>
        </Link>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {recipes.map((recipe: any) => {
            return (
              <div key={recipe.id} className="flex flex-col gap-5">
                <div>
                  <Image
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-96 object-cover rounded"
                    width={1000}
                    height={500}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-700">
                  {recipe.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
