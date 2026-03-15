"use client";

import { motion } from "framer-motion";
import { Nutrition } from "@/types/Recipe";

interface NutritionCardProps {
  nutrition: Nutrition;
  /** Show the caloric breakdown donut chart. Default: true */
  showBreakdown?: boolean;
  /** Compact mode for recipe cards. Default: false */
  compact?: boolean;
}

const NUTRIENT_CONFIG: Record<
  string,
  { color: string; bg: string; icon: string }
> = {
  Calories:      { color: "text-orange-600",  bg: "bg-orange-50",  icon: "🔥" },
  Protein:       { color: "text-blue-600",    bg: "bg-blue-50",    icon: "💪" },
  Fat:           { color: "text-yellow-600",  bg: "bg-yellow-50",  icon: "🧈" },
  Carbohydrates: { color: "text-green-600",   bg: "bg-green-50",   icon: "🌾" },
};

const DEFAULT_CONFIG = { color: "text-gray-600", bg: "bg-gray-50", icon: "⚗️" };

/* ============================================================
   Sub-components
============================================================ */

function NutrientBar({
  name,
  amount,
  unit,
  percent,
}: {
  name: string;
  amount: number;
  unit: string;
  percent: number;
}) {
  const cfg = NUTRIENT_CONFIG[name] ?? DEFAULT_CONFIG;
  const capped = Math.min(percent, 100);

  return (
    <div className={`rounded-xl p-4 ${cfg.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{cfg.icon}</span>
          <span className="font-semibold text-gray-800 text-sm">{name}</span>
        </div>
        <span className={`font-bold text-sm ${cfg.color}`}>
          {amount}
          {unit}
        </span>
      </div>
      <div className="w-full bg-white/70 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${cfg.color.replace("text-", "bg-")}`}
          initial={{ width: 0 }}
          animate={{ width: `${capped}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1 text-right">
        {percent}% daily needs
      </p>
    </div>
  );
}

function CaloricDonut({
  percentProtein,
  percentFat,
  percentCarbs,
}: {
  percentProtein: number;
  percentFat: number;
  percentCarbs: number;
}) {
  // SVG donut using stroke-dasharray technique
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const size = 100;
  const cx = size / 2;
  const cy = size / 2;

  const segments = [
    { label: "Protein",  value: percentProtein, color: "#3b82f6" },
    { label: "Fat",      value: percentFat,      color: "#eab308" },
    { label: "Carbs",    value: percentCarbs,    color: "#22c55e" },
  ];

  let cumulativePercent = 0;

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-32 h-32 -rotate-90">
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="14"
        />
        {segments.map((seg) => {
          const dashArray = `${(seg.value / 100) * circumference} ${circumference}`;
          const dashOffset = -((cumulativePercent / 100) * circumference);
          cumulativePercent += seg.value;
          return (
            <circle
              key={seg.label}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap justify-center">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-xs text-gray-600">
              {seg.label}{" "}
              <span className="font-semibold">{seg.value.toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Main component
============================================================ */

export default function NutritionCard({
  nutrition,
  showBreakdown = true,
  compact = false,
}: NutritionCardProps) {
  const { nutrients, caloricBreakdown } = nutrition;

  if (compact) {
    // Minimal version for recipe cards
    const calories = nutrients.find((n) => n.name === "Calories");
    const protein  = nutrients.find((n) => n.name === "Protein");
    const carbs    = nutrients.find((n) => n.name === "Carbohydrates");
    const fat      = nutrients.find((n) => n.name === "Fat");

    return (
      <div className="flex gap-3 flex-wrap text-xs">
        {[calories, protein, carbs, fat].map((n) => {
          if (!n) return null;
          const cfg = NUTRIENT_CONFIG[n.name] ?? DEFAULT_CONFIG;
          return (
            <span
              key={n.name}
              className={`px-2 py-1 rounded-full font-medium ${cfg.bg} ${cfg.color}`}
            >
              {cfg.icon} {n.amount}
              {n.unit}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>🥗</span> Nutrition Facts
      </h2>

      {/* Per-serving note */}
      <p className="text-sm text-gray-500 mb-4">Per serving · {nutrition.weightPerServing.amount}{nutrition.weightPerServing.unit}</p>

      {/* Nutrient bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {nutrients.map((n) => (
          <NutrientBar
            key={n.name}
            name={n.name}
            amount={n.amount}
            unit={n.unit}
            percent={n.percentOfDailyNeeds}
          />
        ))}
      </div>

      {/* Caloric breakdown donut */}
      {showBreakdown && (
        <div className="border-t pt-6">
          <h3 className="text-base font-semibold text-gray-700 text-center mb-4">
            Caloric Breakdown
          </h3>
          <CaloricDonut
            percentProtein={caloricBreakdown.percentProtein}
            percentFat={caloricBreakdown.percentFat}
            percentCarbs={caloricBreakdown.percentCarbs}
          />
        </div>
      )}
    </div>
  );
}