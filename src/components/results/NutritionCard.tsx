import { motion } from "framer-motion";
import { Flame, Droplets, Beef, Wheat } from "lucide-react";

interface NutritionCardProps {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export function NutritionCard({ calories, protein, carbs, fats }: NutritionCardProps) {
  const macros = [
    { label: "Protein", value: protein, unit: "g", icon: Beef, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Carbs", value: carbs, unit: "g", icon: Wheat, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Fats", value: fats, unit: "g", icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  const total = protein + carbs + fats;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      {/* Calories - Hero */}
      <div className="mb-6 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
          <Flame className="h-5 w-5 text-accent" />
          <span className="text-sm font-medium text-accent">Total Calories</span>
        </div>
        <p className="text-5xl font-extrabold">{calories}</p>
        <p className="text-muted-foreground">kcal</p>
      </div>

      {/* Macro bars */}
      <div className="mb-6 h-3 overflow-hidden rounded-full bg-muted">
        <div className="flex h-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(protein / total) * 100}%` }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-full bg-red-500"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(carbs / total) * 100}%` }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="h-full bg-amber-500"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(fats / total) * 100}%` }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="h-full bg-blue-500"
          />
        </div>
      </div>

      {/* Macro details */}
      <div className="grid grid-cols-3 gap-4">
        {macros.map((macro, index) => (
          <motion.div
            key={macro.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="text-center"
          >
            <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${macro.bg}`}>
              <macro.icon className={`h-5 w-5 ${macro.color}`} />
            </div>
            <p className="text-2xl font-bold">{macro.value}</p>
            <p className="text-xs text-muted-foreground">{macro.unit} {macro.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
