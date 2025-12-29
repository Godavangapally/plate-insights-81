import { motion } from "framer-motion";
import { ChevronDown, Leaf, AlertTriangle } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getApplicableCategories,
  calculateAdjustedCalories,
  type IngredientCategory,
} from "@/lib/ingredientOptions";

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  tags: string[];
  baseCalories?: number;
  selectedIngredients?: Record<string, string>;
}

interface FoodItemsListProps {
  items: FoodItem[];
  onIngredientChange?: (itemIndex: number, categoryId: string, optionId: string) => void;
  isRecalculating?: boolean;
}

const tagColors: Record<string, string> = {
  "High Protein": "bg-red-500/10 text-red-600 border-red-200",
  "High Carbs": "bg-amber-500/10 text-amber-600 border-amber-200",
  "High Fat": "bg-blue-500/10 text-blue-600 border-blue-200",
  "Low Calorie": "bg-green-500/10 text-green-600 border-green-200",
  "Fiber Rich": "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  "Vitamin Rich": "bg-purple-500/10 text-purple-600 border-purple-200",
};

export function FoodItemsList({ items, onIngredientChange, isRecalculating }: FoodItemsListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpand = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Detected Items</h3>
        <span className="text-xs text-muted-foreground">
          Click to customize ingredients
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => {
          const applicableCategories = getApplicableCategories(item.name);
          const isExpanded = expandedItems.has(index);
          const baseCalories = item.baseCalories || item.calories;
          const { isHealthier } = item.selectedIngredients
            ? calculateAdjustedCalories(baseCalories, item.selectedIngredients)
            : { isHealthier: false };

          return (
            <motion.div
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="overflow-hidden rounded-xl border border-border bg-muted/50 transition-all hover:bg-muted"
            >
              {/* Main item row */}
              <button
                onClick={() => toggleExpand(index)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{item.name}</h4>
                    <span className="text-sm text-muted-foreground">({item.quantity})</span>
                    {isHealthier && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600">
                        <Leaf className="h-3 w-3" />
                        Healthier
                      </span>
                    )}
                    {item.selectedIngredients && Object.keys(item.selectedIngredients).length > 0 && !isHealthier && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600">
                        <AlertTriangle className="h-3 w-3" />
                        Modified
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${tagColors[tag] || "bg-muted text-muted-foreground border-border"}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-xl font-bold ${isRecalculating ? "opacity-50" : ""}`}>
                      {item.calories}
                    </p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                    {item.baseCalories && item.baseCalories !== item.calories && (
                      <p className="text-xs text-muted-foreground line-through">
                        {item.baseCalories}
                      </p>
                    )}
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Ingredient customization panel */}
              {isExpanded && applicableCategories.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border bg-background/50 p-4"
                >
                  <p className="mb-3 text-sm font-medium text-muted-foreground">
                    Customize ingredients for accurate calculation:
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {applicableCategories.map((category) => (
                      <IngredientSelect
                        key={category.id}
                        category={category}
                        selectedValue={item.selectedIngredients?.[category.id]}
                        onSelect={(optionId) => {
                          onIngredientChange?.(index, category.id, optionId);
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

interface IngredientSelectProps {
  category: IngredientCategory;
  selectedValue?: string;
  onSelect: (optionId: string) => void;
}

function IngredientSelect({ category, selectedValue, onSelect }: IngredientSelectProps) {
  const selectedOption = category.options.find(o => o.id === selectedValue);

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">
        {category.label}
      </label>
      <Select value={selectedValue || ""} onValueChange={onSelect}>
        <SelectTrigger className="h-9 bg-background">
          <SelectValue placeholder={`Select ${category.label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {category.options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              <span className="flex items-center gap-2">
                {option.label}
                {option.isHealthy && (
                  <Leaf className="h-3 w-3 text-green-500" />
                )}
                {option.multiplier < 1 && (
                  <span className="text-xs text-green-600">
                    -{Math.round((1 - option.multiplier) * 100)}%
                  </span>
                )}
                {option.multiplier > 1 && (
                  <span className="text-xs text-amber-600">
                    +{Math.round((option.multiplier - 1) * 100)}%
                  </span>
                )}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
