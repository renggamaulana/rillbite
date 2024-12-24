import Link from "next/link";
import { motion } from "framer-motion";
export default function MobileMenu({ pathname, isOpen, onClose }: { pathname: string; isOpen: boolean; onClose: () => void }) {
    return (
        <>
        {/* Overlay */}
        {isOpen && (
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
          />
        )}
  
        {/* Menu */}
        <motion.div
          initial={{ x: "-30%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 75 }}
          className={`fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg p-5 z-20`}
        >
          <ul className="flex flex-col gap-5">
            <li>
              <Link  onClick={onClose} href="/">
                <span
                  className={`${
                    pathname === "/"
                      ? "font-bold text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  } font-semibold`}
                >
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link  onClick={onClose} href="/recipes">
                <span
                  className={`${
                    pathname === "/recipes"
                      ? "font-bold text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  } font-semibold`}
                >
                  Recipes
                </span>
              </Link>
            </li>
            <li>
              <Link  onClick={onClose} href="/healty-tips">
                <span
                  className={`${
                    pathname === "/healty-tips"
                      ? "font-bold text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  } font-semibold`}
                >
                  Healthy Tips
                </span>
              </Link>
            </li>
            <li>
              <Link  onClick={onClose} href="/about">
                <span
                  className={`${
                    pathname === "/about"
                      ? "font-bold text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  } font-semibold`}
                >
                  About
                </span>
              </Link>
            </li>
          </ul>
        </motion.div>
      </>
    );
}