"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaUser, 
  FaEnvelope, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaCalendarAlt,
  FaHeart,
  FaUtensils,
  FaChartLine
} from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
// import Image from "next/image";

interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  recipesViewed: number;
  favoriteRecipes: number;
  plansMade: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "demo@rillbite.com",
    joinDate: "January 2024",
    recipesViewed: 127,
    favoriteRecipes: 23,
    plansMade: 8,
  });
  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProfile(editedProfile);
    setIsEditing(false);
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const statsCards = [
    {
      icon: FaUtensils,
      label: "Recipes Viewed",
      value: profile.recipesViewed,
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-100 to-green-50"
    },
    {
      icon: FaHeart,
      label: "Favorite Recipes",
      value: profile.favoriteRecipes,
      color: "from-teal-500 to-cyan-600",
      bgColor: "from-teal-100 to-teal-50"
    },
    {
      icon: FaCalendarAlt,
      label: "Diet Plans Made",
      value: profile.plansMade,
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-100 to-emerald-50"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              My Profile
            </h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Manage your account settings and track your healthy journey
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-white relative">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <FaUser className="text-6xl text-green-600" />
                </div>
                <div className="absolute bottom-0 right-0 bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <FaChartLine className="text-white text-sm" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center md:text-left flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="text-3xl font-bold mb-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border-2 border-white/30 focus:outline-none focus:border-white w-full md:w-auto"
                  />
                ) : (
                  <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
                )}
                <p className="text-green-100 flex items-center justify-center md:justify-start gap-2 mb-1">
                  <FaEnvelope className="text-sm" />
                  {profile.email}
                </p>
                <p className="text-green-100 flex items-center justify-center md:justify-start gap-2 text-sm">
                  <FaCalendarAlt className="text-xs" />
                  Member since {profile.joinDate}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <FaSave />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center gap-2"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <FaEdit />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Account Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 font-semibold mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                    {profile.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-2">
                  Email Address
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  {profile.email}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Activity</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className={`bg-gradient-to-br ${stat.bgColor} p-6`}>
                  <div className={`bg-gradient-to-br ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="text-3xl text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-semibold">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/recipes')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-3"
            >
              <FaUtensils />
              Browse Recipes
            </button>
            <button
              onClick={() => router.push('/diet-plan')}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-3"
            >
              <FaCalendarAlt />
              View Diet Plan
            </button>
          </div>
        </motion.div>

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sign Out</h3>
              <p className="text-gray-600">You can always sign back in anytime</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <MdLogout />
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}