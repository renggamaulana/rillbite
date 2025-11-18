"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link href="/">
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative w-12 h-12 bg-gradient-to-br from-green-400 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Image 
                                    src="/assets/rillbite-logo.png" 
                                    alt="Logo" 
                                    width={32} 
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                                    Rillbite
                                </h1>
                                <p className="text-xs text-gray-500 hidden sm:block">Live your life healthy</p>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex items-center gap-1">
                        <li>
                            <Link href="/">
                                <span className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                    pathname === '/' 
                                        ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}>
                                    Home
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/recipes">
                                <span className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                    pathname.startsWith('/recipes')
                                        ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}>
                                    Recipes
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/diet-plan">
                                <span className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                    pathname === '/diet-plan' 
                                        ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}>
                                    Diet Plan
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/healty-tips">
                                <span className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                    pathname === '/healty-tips' 
                                        ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}>
                                    Healthy Tips
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/about">
                                <span className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                    pathname === '/about' 
                                        ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}>
                                    About
                                </span>
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg 
                            className="w-6 h-6 text-gray-700" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            strokeWidth="2"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <MobileMenu 
                    pathname={pathname} 
                    isOpen={isMenuOpen} 
                    onClose={() => setIsMenuOpen(false)} 
                />
            )}
        </nav>
    )
}