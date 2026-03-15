"use client";

import { NutritionFormData } from "@/types/Recipe";

interface NutritionFormSectionProps {
  data: NutritionFormData;
  onChange: (field: keyof NutritionFormData, value: string) => void;
  /** Show section as collapsible. Default: false */
  collapsible?: boolean;
}

const FIELDS: Array<{
  key: keyof NutritionFormData;
  label: string;
  unit: string;
  icon: string;
  placeholder: string;
}> = [
  { key: "calories",      label: "Calories",      unit: "kcal", icon: "🔥", placeholder: "450" },
  { key: "protein",       label: "Protein",        unit: "g",    icon: "💪", placeholder: "25" },
  { key: "fat",           label: "Fat",            unit: "g",    icon: "🧈", placeholder: "18" },
  { key: "carbohydrates", label: "Carbohydrates",  unit: "g",    icon: "🌾", placeholder: "55" },
];

export default function NutritionFormSection({
  data,
  onChange,
}: NutritionFormSectionProps) {
  return (
    <div className="border border-green-100 rounded-xl p-6 bg-green-50/40">
      <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
        🥗 Nutrition Information
        <span className="text-xs text-gray-400 font-normal">(per serving)</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              {f.icon} {f.label}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.1"
                value={data[f.key]}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full pl-4 pr-14 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                {f.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Leave blank to skip adding nutrition data. You can update it later from the recipe page.
      </p>
    </div>
  );
}