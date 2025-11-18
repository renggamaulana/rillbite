import HomepageBanner from "@/components/HomepageBanner";
import Image from "next/image";
import Link from "next/link";
import { FaUtensils, FaAppleAlt, FaHeart, FaCalendarAlt } from "react-icons/fa";
import { MdTrendingUp, MdTimer } from "react-icons/md";
import { BiDish } from "react-icons/bi";

export default function Homepage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
            <HomepageBanner/>
            
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
                        Welcome to Rillbite
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Your gateway to delicious, nutritious recipes and a healthier lifestyle journey
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                        <div className="text-gray-600 text-sm">Healthy Recipes</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                        <div className="text-4xl font-bold text-teal-600 mb-2">50+</div>
                        <div className="text-gray-600 text-sm">Diet Plans</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                        <div className="text-4xl font-bold text-emerald-600 mb-2">10K+</div>
                        <div className="text-gray-600 text-sm">Happy Users</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                        <div className="text-4xl font-bold text-lime-600 mb-2">100%</div>
                        <div className="text-gray-600 text-sm">Satisfaction</div>
                    </div>
                </div>

                {/* Featured Section */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
                    <div className="order-2 lg:order-1">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">
                            Why Choose Rillbite?
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 group">
                                <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors">
                                    <FaHeart className="text-2xl text-green-600"/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-gray-800 mb-1">Healthy & Delicious</h4>
                                    <p className="text-gray-600">Curated recipes that balance nutrition and taste perfectly</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group">
                                <div className="bg-teal-100 p-3 rounded-xl group-hover:bg-teal-200 transition-colors">
                                    <FaUtensils className="text-2xl text-teal-600"/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-gray-800 mb-1">Customizable Options</h4>
                                    <p className="text-gray-600">Adjust recipes to fit your dietary preferences and needs</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group">
                                <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-200 transition-colors">
                                    <MdTimer className="text-2xl text-emerald-600"/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-gray-800 mb-1">Save Time</h4>
                                    <p className="text-gray-600">Quick and easy recipes for your busy lifestyle</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group">
                                <div className="bg-lime-100 p-3 rounded-xl group-hover:bg-lime-200 transition-colors">
                                    <MdTrendingUp className="text-2xl text-lime-600"/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-gray-800 mb-1">Track Progress</h4>
                                    <p className="text-gray-600">Monitor your nutrition and health goals effortlessly</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                            <Image 
                                src="/assets/images/salad.jpg" 
                                className="w-full h-[500px] object-cover" 
                                alt="Healthy Food" 
                                width={1000} 
                                height={500}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                    </div>
                </div>

                {/* CTA Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <Link href="/recipes">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                            <FaAppleAlt className="text-5xl mb-4"/>
                            <h3 className="text-2xl font-bold mb-2">Explore Recipes</h3>
                            <p className="text-green-50 mb-4">Discover thousands of healthy and delicious recipes</p>
                            <div className="flex items-center text-sm font-semibold">
                                Browse Now <span className="ml-2">→</span>
                            </div>
                        </div>
                    </Link>
                    <Link href="/diet-plan">
                        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                            <FaCalendarAlt className="text-5xl mb-4"/>
                            <h3 className="text-2xl font-bold mb-2">Diet Plans</h3>
                            <p className="text-teal-50 mb-4">Get personalized weekly meal plans for your goals</p>
                            <div className="flex items-center text-sm font-semibold">
                                Start Planning <span className="ml-2">→</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        Everything You Need for Healthy Living
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-green-100 to-green-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <FaHeart className="text-4xl text-green-600" />
                            </div>
                            <h4 className="font-bold text-lg mb-2 text-gray-800">Improve Your Health</h4>
                            <p className="text-gray-600">Boost your wellbeing with nutritious meal choices</p>
                        </div>
                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-teal-100 to-teal-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <MdTimer className="text-4xl text-teal-600" />
                            </div>
                            <h4 className="font-bold text-lg mb-2 text-gray-800">Save Your Time</h4>
                            <p className="text-gray-600">Quick recipes and meal prep strategies</p>
                        </div>
                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <BiDish className="text-4xl text-emerald-600" />
                            </div>
                            <h4 className="font-bold text-lg mb-2 text-gray-800">Plan Your Meals</h4>
                            <p className="text-gray-600">Organize your weekly menu effortlessly</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}