import Link from "next/link";
import { motion } from "framer-motion";

export default function MobileMenu({ 
  pathname, 
  isOpen, 
  onClose 
}: { 
  pathname: string; 
  isOpen: boolean; 
  onClose: () => void 
}) {
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

          {/* Menu Items */}
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
              <Link onClick={onClose} href="/healty-tips">
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === "/healty-tips"
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
      </motion.div>
    </>
  );
}