import Image from "next/image";
// import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative bottom-0 left-0 w-full border-t border-gray-200 bg-white shadow-lg p-5">
            <div className="flex">
                <h1 className="text-2xl font-bold">Rillbite</h1>
                <Image src="/assets/rillbite-logo.png" alt="Logo" width={50} height={50} className="ml-auto"></Image>
            </div>
        </footer>
    )
}