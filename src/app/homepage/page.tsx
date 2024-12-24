import HomepageBanner from "@/components/homepage/HomepageBanner";
import Image from "next/image";
import curry from "/public/assets/images/curry.jpg" // "assets/images/curry.jpg";
import pasta from "/public/assets/images/pasta.jpg";
import chickAndVeg from "/public/assets/images/chick-and-veg.jpg";
import chickAndVeg2 from "/public/assets/images/chick-and-veg2.jpg";

const healthyRecipes = [
    {
        id: 1,
        name: "Curry",
        image: curry
    },
    {
        id: 2,
        name: "Pasta",
        image: pasta
    },
    {
        id: 3,
        name: "Chiken & Vegetable",
        image: chickAndVeg
    },
    {
        id: 4,
        name: "Chiken & Vegetable 2",
        image: chickAndVeg2
    },
];
export default function Homepage() {
    return (
        <div>
            <HomepageBanner/>
            <div className="p-5">
                <div>
                    <h2 className="text-3xl font-bold">Welcome to Rillbite</h2>
                    <p>Discover delicious, nutritious recipes and tips to lead a healthier life.</p>
                </div>
                <div className="mt-10 flex flex-wrap-reverse lg:flex-nowrap gap-20">
                    <div className="mt-5 rounded lg:w-1/3">
                        <Image src="/assets/images/salad.jpg" className="rounded-md w-96 h-[60vh] object-cover" alt="Banner Image" width={1000} height={500}></Image>
                    </div>
                    <div className="flex flex-wrap flex-col gap-4 lg:w-2/3">
                        <div>
                            <h1 className="text-3xl lg:text-5xl font-bold">Why Rillbite?</h1>
                            <p>Rillbite is the best recipe app for anyone who wants to lead a healthier life.</p>
                        </div>
                        <div className="h-[50vh] rounded-lg">
                            <Image src="/assets/images/healthy-family.jpg" className="w-full h-[50vh] object-cover rounded-md" alt="Banner Image" width={1000} height={500}></Image>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <h2 className="text-3xl font-bold mb-10">Our Healthy Recipes</h2>
                    <div className="flex justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {healthyRecipes.map((recipe) => {
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
            </div>
        </div>
    );
}