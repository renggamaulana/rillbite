"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/context/AuthContext";
import { FaUser, FaSignOutAlt, FaHeart, FaCalendarAlt, FaCog } from "react-icons/fa";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, logout, loading } = useAuth();
    
    const handleLogout = async () => {
        await logout();
        router.push('/');
        setShowUserMenu(false);
    };

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
                    <div className="hidden md:flex items-center gap-6">
                        <ul className="flex items-center gap-1">
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

                        {/* Auth Section */}
                        {!loading && (
                            <>
                                {isAuthenticated ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold hover:shadow-lg transition-all"
                                        >
                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                                <FaUser className="text-green-600" />
                                            </div>
                                            <span className="max-w-32 truncate">{user?.name}</span>
                                            <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {showUserMenu && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-10" 
                                                    onClick={() => setShowUserMenu(false)}
                                                />
                                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                                                    <div className="px-4 py-3 border-b border-gray-100">
                                                        <p className="text-sm text-gray-500">Signed in as</p>
                                                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
                                                    </div>
                                                    <Link href="/favorites" onClick={() => setShowUserMenu(false)}>
                                                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors">
                                                            <FaHeart className="text-red-500 text-lg" />
                                                            <span className="text-gray-700 font-medium">My Favorites</span>
                                                        </div>
                                                    </Link>
                                                    <Link href="/diet-plan" onClick={() => setShowUserMenu(false)}>
                                                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors">
                                                            <FaCalendarAlt className="text-teal-500 text-lg" />
                                                            <span className="text-gray-700 font-medium">My Diet Plan</span>
                                                        </div>
                                                    </Link>
                                                    <Link href="/profile" onClick={() => setShowUserMenu(false)}>
                                                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors">
                                                            <FaCog className="text-gray-500 text-lg" />
                                                            <span className="text-gray-700 font-medium">Edit Profile</span>
                                                        </div>
                                                    </Link>
                                                    <div className="border-t border-gray-100 mt-2 pt-2">
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full px-4 py-3 hover:bg-red-50 cursor-pointer flex items-center gap-3 text-red-600 font-medium transition-colors"
                                                        >
                                                            <FaSignOutAlt className="text-lg" />
                                                            <span>Logout</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Link href="/login">
                                            <button className="px-6 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-all">
                                                Login
                                            </button>
                                        </Link>
                                        <Link href="/register">
                                            <button className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 text-white hover:shadow-lg transition-all">
                                                Register
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

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
                    isAuthenticated={isAuthenticated}
                    user={user}
                    onLogout={handleLogout}
                />
            )} 
        </nav>
    )
}