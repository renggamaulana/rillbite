import HomepageBanner from "@/components/HomepageBanner";
import Image from "next/image";
import curry from "/public/assets/images/curry.jpg" // "assets/images/curry.jpg";
import pasta from "/public/assets/images/pasta.jpg";
import chickAndVeg from "/public/assets/images/chick-and-veg.jpg";
import chickAndVeg2 from "/public/assets/images/chick-and-veg2.jpg";
import HealthyRecipes from '../../components/HealthyRecipes';
import { FaHandHoldingMedical } from "react-icons/fa";
import { IoIosHourglass } from "react-icons/io";
import { BiDish } from "react-icons/bi";
import { FcApproval, FcEditImage, FcLike, FcTodoList } from "react-icons/fc";

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
            <div className="flex flex-col gap-10">
                <div className="text-center mt-10">
                    <h2 className="text-3xl font-bold">Welcome to Rillbite</h2>
                    <p>Discover delicious, nutritious recipes and tips to lead a healthier life.</p>
                </div>
                <div className="w-5/6 mx-auto flex flex-wrap lg:flex-nowrap gap-20">
                    <div className="mt-5 rounded lg:w-1/3">
                        <Image src="/assets/images/salad.jpg" className="rounded-md w-full h-full object-cover" alt="Banner Image" width={1000} height={500}></Image>
                    </div>
                    <div className="flex flex-wrap flex-col gap-4 lg:w-2/3">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold">Why Rillbite?</h1>
                            <p>Rillbite is the best recipe app for anyone who wants to lead a healthier life.</p>
                        </div>
                        <div className="rounded-lg">
                            <div className="mt-5 grid grid-cols-1 gap-10 lg:grid-cols-2">
                                <div className="flex flex-col items-center text-center border rounded shadow p-5 gap-3">
                                    <div>
                                        <FcApproval className="text-4xl"/>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <h2 className="text-xl font-bold text-neutral-700">Healthy and Delicious Recipes</h2>
                                        <p className="text-md tracking-wide text-neutral-600">Rillbite offers a wide variety of recipes crafted to support a healthy lifestyle without compromising on taste. Every recipe is carefully curated for balanced nutrition.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center text-center border rounded shadow p-5 gap-3">
                                    <div>
                                        <FcEditImage className="text-4xl"/>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <h2 className="text-xl font-bold text-neutral-700">Customizable Recipes to Fit Your Needs</h2>
                                        <p className="text-md tracking-wide text-neutral-600">With Rillbite, you can adjust ingredients and portions based on your dietary preferences, such as vegetarian, low-sugar, or gluten-free options.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center text-center border rounded shadow p-5 gap-3">
                                    <div>
                                        <FcLike className="text-4xl"/>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <h2 className="text-xl font-bold text-neutral-700">User-Friendly for Everyone</h2>
                                        <p className="text-md tracking-wide text-neutral-600">The app is simple and intuitive interface makes it easy for anyone, from beginners to experienced cooks, to follow recipes and create healthy meals at home.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center text-center border rounded shadow p-5 gap-3">
                                    <div>
                                        <FcTodoList className="text-4xl"/>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <h2 className="text-xl font-bold text-neutral-700">Comprehensive Features for a Healthy Life</h2>
                                        <p className="text-md tracking-wide text-neutral-600">Beyond recipes, Rillbite includes additional features like calorie calculators, automated shopping lists, and nutrition tips to help you plan a healthier daily diet.</p>
                                    </div>
                                </div>
                            </div>
                            {/* <Image src="/assets/images/healthy-family.jpg" className="w-full h-[50vh] object-cover rounded-md" alt="Banner Image" width={1000} height={500}></Image> */}
                        </div>
                    </div>
                </div>
                <HealthyRecipes recipes={healthyRecipes} />
                <div className="p-10 rounded-lg bg-gradient-to-r from-slate-50 via-green-50 to-teal-50">
                        <h2 className="text-3xl font-bold mb-10">Get Started</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 ">
                            <div className="flex items-center flex-col gap-3 p-5 border border-slate-400 rounded-lg">
                                <FaHandHoldingMedical className="text-5xl text-green-600" />
                                <p>Increase your healt with rillbite</p>
                            </div>
                            <div className="flex items-center flex-col gap-3 p-5 border border-slate-400 rounded-lg">
                                <IoIosHourglass className="text-5xl text-green-600" />
                                <p>Save your time with rillbite</p>
                            </div>
                            <div className="flex items-center flex-col gap-3 p-5 border border-slate-400 rounded-lg">
                                <BiDish className="text-5xl text-green-600" />
                                <p>Make your own schedule with rillbite</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
}