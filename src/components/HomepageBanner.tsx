"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomepageBanner() {
    return (
        <div className="relative w-full h-[80vh] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image 
                    src="/assets/images/banner.jpg" 
                    alt="Banner Image" 
                    fill
                    priority
                    className="object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-block"
                        >
                            <span className="bg-gradient-to-r from-green-400 to-teal-400 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                                ✨ Your Health Journey Starts Here
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
                        >
                            Elevate Your
                            <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                                {" "}Cooking{" "}
                            </span>
                            Experience
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="text-lg md:text-xl text-gray-200 mb-8"
                        >
                            Discover nutritious recipes, personalized meal plans, and expert tips 
                            to transform your lifestyle into a healthier, happier you.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link href="/recipes">
                                <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                    Explore Recipes
                                </button>
                            </Link>
                            <Link href="/diet-plan">
                                <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold border-2 border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                                    Get Diet Plan
                                </button>
                            </Link>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="flex flex-wrap gap-8 mt-12"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-green-500/20 backdrop-blur-md p-3 rounded-full">
                                    <span className="text-2xl">🥗</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">500+</div>
                                    <div className="text-sm text-gray-300">Recipes</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-teal-500/20 backdrop-blur-md p-3 rounded-full">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">50+</div>
                                    <div className="text-sm text-gray-300">Meal Plans</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500/20 backdrop-blur-md p-3 rounded-full">
                                    <span className="text-2xl">❤️</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">10K+</div>
                                    <div className="text-sm text-gray-300">Happy Users</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </div>
    );
}