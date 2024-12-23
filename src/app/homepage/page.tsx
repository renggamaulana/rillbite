import Image from "next/image";

export default function Homepage() {
    return (
        <div>
            <div className="relative w-full">
                <div className="w-full">
                    <Image src="/assets/images/banner.jpg" alt="Banner Image" width={1920} height={500} className="w-full h-[50vh] object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
                    <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <h1 className="text-2xl lg:text-3xl font-bold text-white">Elevate Your Cooking Experience</h1>
                        <p className="text-md lg:text-lg text-white">Explore Nutritious Recipes, Crafted to Inspire Your Healthy Lifestyle.</p>
                    </div>
                </div>
            </div>
            <div className="p-5 h-screen">
                <div>
                    <h2 className="text-3xl font-bold">Welcome to Rillbite</h2>
                    <p>Discover delicious, nutritious recipes and tips to lead a healthier life.</p>
                </div>
                <div className="mt-10 flex gap-20">
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
            </div>
        </div>
    );
}