import { motion } from "framer-motion";
import { Lightbulb, ThumbsUp, AlertTriangle, TrendingUp } from "lucide-react";

interface Suggestion {
  type: "positive" | "warning" | "tip";
  text: string;
}

interface HealthSuggestionsProps {
  suggestions: Suggestion[];
  overallScore: "balanced" | "needs-improvement" | "great";
}

const iconMap = {
  positive: ThumbsUp,
  warning: AlertTriangle,
  tip: Lightbulb,
};

const colorMap = {
  positive: "text-success bg-success/10 border-success/20",
  warning: "text-warning bg-warning/10 border-warning/20",
  tip: "text-primary bg-primary/10 border-primary/20",
};

const scoreConfig = {
  "balanced": { label: "Balanced Meal", color: "text-success", bg: "bg-success/10" },
  "needs-improvement": { label: "Room for Improvement", color: "text-warning", bg: "bg-warning/10" },
  "great": { label: "Excellent Choice!", color: "text-primary", bg: "bg-primary/10" },
};

export function HealthSuggestions({ suggestions, overallScore }: HealthSuggestionsProps) {
  const scoreInfo = scoreConfig[overallScore];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      {/* Overall Score */}
      <div className="mb-6 flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${scoreInfo.bg}`}>
          <TrendingUp className={`h-6 w-6 ${scoreInfo.color}`} />
        </div>
        <div>
          <h3 className="text-lg font-bold">Health Insights</h3>
          <p className={`text-sm font-medium ${scoreInfo.color}`}>{scoreInfo.label}</p>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const Icon = iconMap[suggestion.type];
          const colors = colorMap[suggestion.type];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`flex items-start gap-3 rounded-xl border p-4 ${colors}`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm">{suggestion.text}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
