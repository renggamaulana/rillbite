import Link from "next/link";
import { motion } from "framer-motion";
import { FaUser, FaSignOutAlt, FaHeart, FaCalendarAlt, FaCog, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface MobileMenuProps {
  pathname: string;
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
}

export default function MobileMenu({ 
  pathname, 
  isOpen, 
  onClose,
}: MobileMenuProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    onClose();
    router.push('/');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {/* Menu */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Menu
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg 
                className="w-6 h-6 text-gray-700" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User Info Section */}
          {isAuthenticated && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 truncate">{user?.name}</p>
                  <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu Items */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
              Navigation
            </p>
            <ul className="space-y-2">
              <li>
                <Link onClick={onClose} href="/">
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    pathname === "/"
                      ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="font-semibold">Home</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link onClick={onClose} href="/recipes">
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    pathname.startsWith('/recipes')
                      ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="font-semibold">Recipes</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link onClick={onClose} href="/diet-plan">
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    pathname === "/diet-plan"
                      ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold">Diet Plan</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link onClick={onClose} href="/healthy-tips">
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    pathname === "/healthy-tips"
                      ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-semibold">Healthy Tips</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link onClick={onClose} href="/about">
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    pathname === "/about"
                      ? "bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">About</span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* User Account Section */}
          {isAuthenticated ? (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                My Account
              </p>
              <ul className="space-y-2 mb-4">
                <li>
                  <Link onClick={onClose} href="/favorites">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all">
                      <FaHeart className="w-5 h-5 text-red-500" />
                      <span className="font-semibold">My Favorites</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link onClick={onClose} href="/diet-plan">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all">
                      <FaCalendarAlt className="w-5 h-5 text-teal-500" />
                      <span className="font-semibold">My Diet Plan</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link onClick={onClose} href="/profile">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all">
                      <FaCog className="w-5 h-5 text-gray-500" />
                      <span className="font-semibold">Edit Profile</span>
                    </div>
                  </Link>
                </li>
              </ul>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all font-semibold"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            /* Auth Buttons for Non-Authenticated Users */
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <Link onClick={onClose} href="/login">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all font-semibold">
                  <FaSignInAlt className="w-5 h-5" />
                  <span>Login</span>
                </div>
              </Link>
              <Link onClick={onClose} href="/register">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 text-white hover:shadow-lg transition-all font-semibold">
                  <FaUserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 mt-auto">
          <p className="text-xs text-gray-500 text-center">
            © 2024 Rillbite. All rights reserved.
          </p>
        </div>
      </motion.div>
    </>
  );
}