"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart, FaUsers, FaLeaf, FaLightbulb, FaRocket, FaAward } from "react-icons/fa";
import { MdHealthAndSafety, MdRestaurant } from "react-icons/md";
import { BiWorld } from "react-icons/bi";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const values = [
    {
      icon: <FaHeart className="text-4xl text-red-500" />,
      title: "Health First",
      description: "We prioritize your wellbeing with nutritionally balanced recipes",
      color: "from-red-100 to-red-50"
    },
    {
      icon: <MdHealthAndSafety className="text-4xl text-green-600" />,
      title: "Quality Ingredients",
      description: "Fresh, organic, and sustainable food choices for better living",
      color: "from-green-100 to-green-50"
    },
    {
      icon: <FaUsers className="text-4xl text-blue-600" />,
      title: "Community Driven",
      description: "Built by food lovers, for food lovers around the world",
      color: "from-blue-100 to-blue-50"
    },
    {
      icon: <FaLightbulb className="text-4xl text-yellow-600" />,
      title: "Innovation",
      description: "Constantly evolving with new recipes and features",
      color: "from-yellow-100 to-yellow-50"
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & Head Chef",
      image: "/assets/images/team1.jpg",
      bio: "15+ years of culinary experience"
    },
    {
      name: "Michael Chen",
      role: "Nutritionist",
      image: "/assets/images/team2.jpg",
      bio: "Certified nutrition specialist"
    },
    {
      name: "Emily Rodriguez",
      role: "Recipe Developer",
      image: "/assets/images/team3.jpg",
      bio: "Award-winning food creator"
    }
  ];

  const milestones = [
    { year: "2020", event: "Rillbite was founded", icon: <FaRocket /> },
    { year: "2021", event: "Reached 1,000 recipes", icon: <MdRestaurant /> },
    { year: "2022", event: "10K+ active users", icon: <FaUsers /> },
    { year: "2023", event: "Best Health App Award", icon: <FaAward /> },
    { year: "2024", event: "Global expansion", icon: <BiWorld /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Rillbite
            </h1>
            <p className="text-green-100 text-xl max-w-3xl mx-auto leading-relaxed">
              Transforming the way people discover, cook, and enjoy healthy meals. 
              We believe that eating well should be simple, delicious, and accessible to everyone.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Rillbite was born from a simple idea: healthy eating shouldn't be complicated. 
                  Our founder, a passionate chef and nutrition enthusiast, noticed that many people 
                  struggled to find recipes that were both nutritious and delicious.
                </p>
                <p>
                  In 2020, we started with just 50 recipes and a small community of food lovers. 
                  Today, we've grown into a platform with over 500 carefully curated recipes, 
                  serving thousands of users worldwide who share our passion for healthy living.
                </p>
                <p>
                  Every recipe on Rillbite is crafted with care, tested multiple times, and 
                  designed to make your journey to better health as enjoyable as possible.
                </p>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/assets/images/salad.jpg"
                alt="Our Story"
                width={600}
                height={500}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl"
            >
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <FaLeaf className="text-4xl" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-green-50 leading-relaxed">
                To empower people worldwide to make healthier food choices through 
                accessible, delicious recipes and personalized nutrition guidance. 
                We're committed to making healthy eating simple, enjoyable, and sustainable.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-8 text-white shadow-xl"
            >
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <FaRocket className="text-4xl" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-teal-50 leading-relaxed">
                To become the world's most trusted platform for healthy cooking, 
                inspiring millions to embrace nutritious eating habits and create 
                a global community of health-conscious food enthusiasts.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Core Values */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className={`bg-gradient-to-br ${value.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-500 to-emerald-600"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="text-green-600 font-bold text-xl mb-2">
                        {milestone.year}
                      </div>
                      <div className="text-gray-800 font-semibold">
                        {milestone.event}
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white z-10">
                    {milestone.icon}
                  </div>
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Meet Our Team
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Passionate food experts dedicated to bringing you the best healthy recipes
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="relative h-64 bg-gradient-to-br from-green-200 to-emerald-200">
                  {/* Placeholder for team images */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaUsers className="text-6xl text-green-600/30" />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-green-600 font-semibold mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Healthy Community
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Start your journey to healthier eating today with personalized recipes and meal plans
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
              >
                Get Started Free
              </motion.button>
            </Link>
            <Link href="/recipes">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all"
              >
                Browse Recipes
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}