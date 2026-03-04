"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus, FaTrash, FaSearch, FaTimes,
  FaUtensils, FaClock, FaUsers, FaHeart, FaBookOpen,
} from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getDietPlan,
  addToDietPlan,
  removeMealFromPlan,
  clearDietPlan,
  searchRecipes,
  getFavorites,
} from "@/utils/api";

/* ─── Types ─────────────────────────────────────────────── */
interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
}

interface MealSlot {
  id?: number;
  recipe: Recipe | null;
}

interface DayPlan {
  breakfast: MealSlot;
  lunch: MealSlot;
  dinner: MealSlot;
}

interface WeekPlan {
  [key: string]: DayPlan;
}

type ModalTab = "all" | "favorites";

/* ─── Constants ──────────────────────────────────────────── */
const DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

const DAY_SHORT: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed",
  thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun",
};
const DAY_FULL: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday",
  thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

const MEAL_TYPES = [
  {
    key: "breakfast", label: "Breakfast", emoji: "☀️", time: "7:00 – 9:00 AM",
    color: "from-amber-400 to-orange-400", bg: "bg-amber-50",
    border: "border-amber-200", text: "text-amber-700",
  },
  {
    key: "lunch", label: "Lunch", emoji: "🌤️", time: "12:00 – 2:00 PM",
    color: "from-teal-400 to-cyan-500", bg: "bg-teal-50",
    border: "border-teal-200", text: "text-teal-700",
  },
  {
    key: "dinner", label: "Dinner", emoji: "🌙", time: "6:00 – 8:00 PM",
    color: "from-indigo-400 to-violet-500", bg: "bg-indigo-50",
    border: "border-indigo-200", text: "text-indigo-700",
  },
];

const EMPTY_PLAN = (): WeekPlan =>
  Object.fromEntries(
    DAYS.map((d) => [
      d,
      { breakfast: { recipe: null }, lunch: { recipe: null }, dinner: { recipe: null } },
    ])
  ) as WeekPlan;

/* ─── Component ──────────────────────────────────────────── */
export default function DietPlan() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [selectedDay, setSelectedDay] = useState("monday");
  const [weekPlan, setWeekPlan] = useState<WeekPlan>(EMPTY_PLAN());
  const [loading, setLoading] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState("");
  const [modalTab, setModalTab] = useState<ModalTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Recipe[]>([]);

  /* ── Auth guard ── */
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
    else if (isAuthenticated) {
      loadDietPlan();
      loadAllRecipes();
      loadFavorites();
    }
  }, [isAuthenticated, authLoading]);

  /* ── Data loaders ── */
  const loadDietPlan = async () => {
    try {
      setLoading(true);
      const response = await getDietPlan(1);
      const plan = EMPTY_PLAN();
      if (response.plan) {
        Object.keys(response.plan).forEach((day) => {
          const d = response.plan[day];
          (["breakfast", "lunch", "dinner"] as const).forEach((m) => {
            if (d[m]) plan[day][m] = { id: d[m].id, recipe: d[m].recipe };
          });
        });
      }
      setWeekPlan(plan);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadAllRecipes = async () => {
    try {
      const r = await searchRecipes("", 100);
      setAllRecipes(r);
      setSearchResults(r);
    } catch (e) { console.error(e); }
  };

  const loadFavorites = async () => {
    try {
      const res = await getFavorites();
      // API may return { favorites: [...] } or array directly
      const list: any[] = Array.isArray(res) ? res : (res.favorites ?? res.data ?? []);
      // Normalize: some APIs nest the recipe inside item.recipe
      const normalized = list.map((item: any) =>
        item.recipe ? item.recipe : item
      ) as Recipe[];
      setFavoriteRecipes(normalized);
      setFilteredFavorites(normalized);
    } catch (e) { console.error(e); }
  };

  /* ── Search ── */
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    const lq = q.toLowerCase();
    if (!q.trim()) {
      setSearchResults(allRecipes);
      setFilteredFavorites(favoriteRecipes);
      return;
    }
    setSearchResults(allRecipes.filter((r) => r.title.toLowerCase().includes(lq)));
    setFilteredFavorites(favoriteRecipes.filter((r) => r.title.toLowerCase().includes(lq)));
  };

  /* ── Actions ── */
  const openModal = (mealType: string) => {
    if (!isAuthenticated) { router.push("/login"); return; }
    setActiveMealType(mealType);
    setModalTab("all");
    setSearchQuery("");
    setSearchResults(allRecipes);
    setFilteredFavorites(favoriteRecipes);
    setModalOpen(true);
  };

  const addRecipe = async (recipe: Recipe) => {
    try {
      setLoading(true);
      await addToDietPlan(recipe.id, selectedDay, activeMealType);
      await loadDietPlan();
      setModalOpen(false);
    } catch {
      alert("Failed to add recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeRecipe = async (mealId: number) => {
    try {
      setLoading(true);
      await removeMealFromPlan(mealId);
      await loadDietPlan();
    } catch {
      alert("Failed to remove meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = async () => {
    if (!confirm("Clear all meals for this week?")) return;
    try {
      setLoading(true);
      await clearDietPlan(1);
      await loadDietPlan();
    } catch {
      alert("Failed to clear diet plan.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Derived ── */
  const filledMeals = Object.values(weekPlan).reduce(
    (acc, day) =>
      acc + (["breakfast","lunch","dinner"] as const).filter((m) => day[m].recipe).length,
    0
  );
  const totalSlots = DAYS.length * 3;
  const progressPct = Math.round((filledMeals / totalSlots) * 100);
  const activeRecipes = modalTab === "favorites" ? filteredFavorites : searchResults;

  if (authLoading) return <FullPageSpinner />;
  if (!isAuthenticated) return null;

  const currentDayPlan = weekPlan[selectedDay];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#f0fdf4 0%,#f0f9ff 50%,#faf5ff 100%)" }}>

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-emerald-500 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width:`${120+i*80}px`, height:`${120+i*80}px`, top:`${-20+i*10}px`, right:`${-30+i*15}px`, opacity:0.4 }} />
          ))}
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur rounded-2xl">
                <FaUtensils className="text-2xl" />
              </div>
              <div>
                <p className="text-teal-200 text-sm font-medium tracking-widest uppercase">Weekly Meal Planner</p>
                <h1 className="text-3xl sm:text-4xl font-bold">My Diet Plan</h1>
              </div>
            </div>
            <p className="text-teal-100 max-w-xl mt-2">
              Plan healthy meals for your entire week — breakfast, lunch &amp; dinner.
            </p>
            <div className="mt-8 max-w-sm">
              <div className="flex justify-between text-sm text-teal-200 mb-2">
                <span>{filledMeals} of {totalSlots} slots filled</span>
                <span className="font-bold text-white">{progressPct}%</span>
              </div>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div className="h-full bg-white rounded-full"
                  initial={{ width:0 }} animate={{ width:`${progressPct}%` }} transition={{ duration:0.8, ease:"easeOut" }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* ── Toolbar ── */}
        <div className="flex justify-end">
          <button onClick={clearAll} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-red-500 border border-red-200 font-semibold text-sm hover:bg-red-50 hover:border-red-400 transition-all shadow-sm disabled:opacity-50">
            <FaTrash className="text-xs" /> Clear All
          </button>
        </div>

        {/* ── Day Selector ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {DAYS.map((day) => {
              const isActive = selectedDay === day;
              return (
                <button key={day} onClick={() => setSelectedDay(day)}
                  className={`relative flex flex-col items-center px-4 py-3 rounded-xl font-semibold transition-all min-w-[64px] ${
                    isActive
                      ? "bg-gradient-to-b from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <span className="text-xs opacity-80">{DAY_SHORT[day]}</span>
                  <div className="flex gap-0.5 mt-1.5">
                    {(["breakfast","lunch","dinner"] as const).map((m) => (
                      <div key={m} className={`w-1.5 h-1.5 rounded-full ${
                        weekPlan[day]?.[m]?.recipe
                          ? isActive ? "bg-white" : "bg-teal-400"
                          : isActive ? "bg-white/30" : "bg-gray-200"
                      }`} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Meal Slots ── */}
        <motion.div key={selectedDay} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.25 }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{DAY_FULL[selectedDay]}</h2>

          <div className="space-y-4">
            {MEAL_TYPES.map((mt) => {
              const meal = currentDayPlan?.[mt.key as keyof DayPlan];
              const recipe = meal?.recipe;

              return (
                <div key={mt.key} className={`bg-white rounded-2xl shadow-sm border ${mt.border} overflow-hidden`}>
                  <div className={`${mt.bg} px-5 py-3 flex items-center justify-between border-b ${mt.border}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{mt.emoji}</span>
                      <div>
                        <p className={`font-bold ${mt.text}`}>{mt.label}</p>
                        <p className="text-xs text-gray-400">{mt.time}</p>
                      </div>
                    </div>
                    <button onClick={() => openModal(mt.key)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${mt.color} shadow-sm hover:opacity-90 transition-opacity`}>
                      <FaPlus className="text-xs" />
                      {recipe ? "Change" : "Add Recipe"}
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {recipe ? (
                      <motion.div key="filled" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        className="flex items-stretch">
                        <div className="relative w-32 sm:w-40 flex-shrink-0 cursor-pointer"
                          onClick={() => router.push(`/recipes/${recipe.id}`)}>
                          <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-gray-800 text-base sm:text-lg leading-snug mb-3 line-clamp-2 cursor-pointer hover:text-teal-600 transition-colors"
                              onClick={() => router.push(`/recipes/${recipe.id}`)}>
                              {recipe.title}
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {recipe.readyInMinutes && (
                                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                                  <FaClock className="text-teal-400" /> {recipe.readyInMinutes} min
                                </span>
                              )}
                              {recipe.servings && (
                                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                                  <FaUsers className="text-teal-400" /> {recipe.servings} servings
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button onClick={() => router.push(`/recipes/${recipe.id}`)}
                              className="text-xs font-semibold text-teal-600 hover:text-teal-700 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-all">
                              View Recipe
                            </button>
                            {meal?.id && (
                              <button onClick={() => removeRecipe(meal.id!)}
                                className="text-xs font-semibold text-red-500 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all flex items-center gap-1">
                                <FaTrash className="text-[10px]" /> Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        className="py-10 text-center">
                        <div className="text-4xl mb-2">🍽️</div>
                        <p className="text-gray-400 text-sm">No meal selected — click "Add Recipe" to get started</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Recipe Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />

            <motion.div
              className="relative bg-white w-full sm:max-w-3xl rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
              initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
              transition={{ type:"spring", damping:30, stiffness:300 }}>

              {/* Modal header + tabs + search */}
              {(() => {
                const mt = MEAL_TYPES.find((m) => m.key === activeMealType);
                return (
                  <div className={`bg-gradient-to-r ${mt?.color ?? "from-teal-500 to-cyan-500"} text-white p-5`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-white/80 font-medium">{DAY_FULL[selectedDay]}</p>
                        <h2 className="text-xl font-bold">{mt?.emoji} Choose Recipe for {mt?.label}</h2>
                      </div>
                      <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                        <FaTimes />
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4">
                      <button onClick={() => setModalTab("all")}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                          modalTab === "all"
                            ? "bg-white text-gray-800 shadow"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}>
                        <FaBookOpen className="text-xs" /> All Recipes
                      </button>
                      <button onClick={() => setModalTab("favorites")}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                          modalTab === "favorites"
                            ? "bg-white text-gray-800 shadow"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}>
                        <FaHeart className="text-xs" /> My Favorites
                        {favoriteRecipes.length > 0 && (
                          <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            modalTab === "favorites" ? "bg-red-100 text-red-500" : "bg-white/30 text-white"
                          }`}>{favoriteRecipes.length}</span>
                        )}
                      </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60 text-sm" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder={modalTab === "favorites" ? "Search your favorites…" : "Search all recipes…"}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/30 text-sm"
                        autoFocus
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Results grid */}
              <div className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                  {activeRecipes.length > 0 ? (
                    <motion.div key={modalTab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {activeRecipes.map((recipe) => (
                        <motion.div key={recipe.id} whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
                          onClick={() => addRecipe(recipe)}
                          className="border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:border-teal-300 transition-all group">
                          <div className="relative h-32">
                            <Image src={recipe.image} alt={recipe.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                            {modalTab === "favorites" && (
                              <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow">
                                <FaHeart className="text-[10px]" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                              <span className="text-white text-xs font-bold flex items-center gap-1">
                                <FaPlus /> Add to Plan
                              </span>
                            </div>
                          </div>
                          <div className="p-2.5">
                            <p className="font-semibold text-gray-800 text-xs leading-snug line-clamp-2 mb-1">{recipe.title}</p>
                            <div className="flex gap-2 text-[10px] text-gray-400">
                              {recipe.readyInMinutes && <span>⏱ {recipe.readyInMinutes}m</span>}
                              {recipe.servings && <span>🍽 {recipe.servings} srv</span>}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div key={`empty-${modalTab}`} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                      className="py-16 text-center">
                      {modalTab === "favorites" ? (
                        <>
                          <div className="text-5xl mb-3">💔</div>
                          <p className="text-gray-500 font-medium">No favorites found</p>
                          <p className="text-gray-400 text-sm mt-1">
                            {searchQuery ? "Try a different keyword" : "Save recipes to your favorites first"}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-5xl mb-3">🔍</div>
                          <p className="text-gray-500 font-medium">No recipes found</p>
                          <p className="text-gray-400 text-sm mt-1">Try searching with different keywords</p>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t p-4 flex justify-end">
                <button onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-all">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading overlay ── */}
      <AnimatePresence>
        {loading && (
          <motion.div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-40 flex items-center justify-center"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <div className="p-6 bg-white rounded-2xl shadow-xl flex items-center gap-4">
              <div className="w-8 h-8 border-[3px] border-teal-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600 font-medium">Loading…</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-white">
      <div className="w-14 h-14 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}