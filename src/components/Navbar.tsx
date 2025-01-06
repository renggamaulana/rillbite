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
        <nav className="bg-white shadow-lg p-5 sticky top-0 z-10 flex justify-between items-center">
            <div className="flex items-center">
                <Image src="/assets/rillbite-logo.png" alt="Logo" width={50} height={50} />
                <div className="ml-3 flex flex-col gap-0">
                    <h1 className="text-2xl font-bold text-green-700">Rillbite</h1>
                    <p className="text-sm text-gray-600">Live your life with Rillbite</p>
                </div>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
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
            </div>

            {/* Desktop Menu */}
            <ul className="md:flex hidden md:items-center md:gap-5">
                <li>
                    <Link href="/">
                        <span className={`${pathname === '/' ? 'font-bold text-green-600' : 'text-gray-700 hover:text-green-600'} font-semibold`}>
                            Home
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="/recipes">
                        <span className={`${pathname === '/recipes' ? 'font-bold text-green-600' : 'text-gray-700 hover:text-green-600'} font-semibold`}>
                            Recipes
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="/healty-tips">
                        <span className={`${pathname === '/healty-tips' ? 'font-bold text-green-600' : 'text-gray-700 hover:text-green-600'} font-semibold`}>
                            Healthy Tips
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="/about">
                        <span className={`${pathname === '/about' ? 'font-bold text-green-600' : 'text-gray-700 hover:text-green-600'} font-semibold`}>
                            About
                        </span>
                    </Link>
                </li>
            </ul>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <MobileMenu pathname={pathname} isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}  />
            )}
        </nav>
    )
}