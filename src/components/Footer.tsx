import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-12 h-12 bg-gradient-to-br from-green-400 to-teal-600 rounded-xl flex items-center justify-center">
                                <Image 
                                    src="/assets/rillbite-logo.png" 
                                    alt="Logo" 
                                    width={32} 
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                                Rillbite
                            </h2>
                        </div>
                        <p className="text-gray-600 mb-4 max-w-md">
                            Your trusted companion for healthy living. Discover delicious recipes, 
                            personalized meal plans, and expert nutrition tips.
                        </p>
                        <div className="flex gap-3">
                            <a 
                                href="#" 
                                className="bg-gray-100 p-3 rounded-full hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 hover:text-white transition-all duration-300"
                            >
                                <FaFacebook className="text-xl" />
                            </a>
                            <a 
                                href="#" 
                                className="bg-gray-100 p-3 rounded-full hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 hover:text-white transition-all duration-300"
                            >
                                <FaInstagram className="text-xl" />
                            </a>
                            <a 
                                href="#" 
                                className="bg-gray-100 p-3 rounded-full hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 hover:text-white transition-all duration-300"
                            >
                                <FaTwitter className="text-xl" />
                            </a>
                            <a 
                                href="#" 
                                className="bg-gray-100 p-3 rounded-full hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 hover:text-white transition-all duration-300"
                            >
                                <FaYoutube className="text-xl" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/recipes" className="text-gray-600 hover:text-green-600 transition-colors">
                                    Recipes
                                </Link>
                            </li>
                            <li>
                                <Link href="/diet-plan" className="text-gray-600 hover:text-green-600 transition-colors">
                                    Diet Plan
                                </Link>
                            </li>
                            <li>
                                <Link href="/healty-tips" className="text-gray-600 hover:text-green-600 transition-colors">
                                    Healthy Tips
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 text-sm text-center md:text-left">
                            © 2024 Rillbite. All rights reserved. Made with ❤️ for healthy living.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                                Privacy
                            </a>
                            <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                                Terms
                            </a>
                            <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}