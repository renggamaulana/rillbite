import Image from "next/image";

export default function UnderContruction() {
    return (
        <div className="text-center h-screen flex flex-col justify-center items-center -mt-20">
            <div className="">
                <Image className="w-72 h-72" src="/assets/under-construction.png" alt="Logo" width={1000} height={500}/>
            </div>
            <div className="-mt-10">
                <h1 className="text-3xl font-bold text-gray-700">Excuse Our Dust</h1>
                <p className="text-gray-600 italic text-lg"> — This page is currently under development. We’re crafting something wonderful just for you. Please check back soon! —</p>
            </div>

        </div>
    );
}