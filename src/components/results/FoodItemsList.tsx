import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  tags: string[];
}

interface FoodItemsListProps {
  items: FoodItem[];
}

const tagColors: Record<string, string> = {
  "High Protein": "bg-red-500/10 text-red-600 border-red-200",
  "High Carbs": "bg-amber-500/10 text-amber-600 border-amber-200",
  "High Fat": "bg-blue-500/10 text-blue-600 border-blue-200",
  "Low Calorie": "bg-green-500/10 text-green-600 border-green-200",
  "Fiber Rich": "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  "Vitamin Rich": "bg-purple-500/10 text-purple-600 border-purple-200",
};

export function FoodItemsList({ items }: FoodItemsListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      <h3 className="mb-4 text-lg font-bold">Detected Items</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-center justify-between rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{item.name}</h4>
                <span className="text-sm text-muted-foreground">({item.quantity})</span>
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
            <div className="text-right">
              <p className="text-xl font-bold">{item.calories}</p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
