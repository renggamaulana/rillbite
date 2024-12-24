import Image from "next/image";

export default function HomepageBanner() {
    return(
        <div className="relative w-full">
                        <div className="w-full">
                            <Image src="/assets/images/banner.jpg" alt="Banner Image" width={1920} height={500} className="w-full h-[50vh] object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
                            <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
                                <h1 className="text-2xl whitespace-pre-wrap lg:text-3xl font-bold text-white">Elevate Your Cooking Experience</h1>
                                <p className="text-md lg:text-lg text-white">Explore Nutritious Recipes, Crafted to Inspire Your Healthy Lifestyle.</p>
                            </div>
                        </div>
                    </div>
    )
}