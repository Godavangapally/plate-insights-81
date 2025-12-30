import { motion } from "framer-motion";
import { Lightbulb, ThumbsUp, AlertTriangle, TrendingUp, Heart, ShieldCheck, ShieldAlert } from "lucide-react";

interface Suggestion {
  type: "positive" | "warning" | "tip";
  text: string;
}

interface HealthSuggestionsProps {
  suggestions: Suggestion[];
  overallScore: "balanced" | "needs-improvement" | "great";
  healthClassification?: "Healthy" | "Moderate" | "Unhealthy";
  healthReason?: string;
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

const healthClassConfig = {
  "Healthy": { 
    label: "Healthy", 
    color: "text-success", 
    bg: "bg-success/10", 
    border: "border-success/30",
    Icon: ShieldCheck,
    description: "Great choices! This meal supports your health goals."
  },
  "Moderate": { 
    label: "Moderate", 
    color: "text-warning", 
    bg: "bg-warning/10", 
    border: "border-warning/30",
    Icon: Heart,
    description: "A balanced meal with some room for healthier swaps."
  },
  "Unhealthy": { 
    label: "Unhealthy", 
    color: "text-destructive", 
    bg: "bg-destructive/10", 
    border: "border-destructive/30",
    Icon: ShieldAlert,
    description: "Consider healthier alternatives for regular consumption."
  },
};

export function HealthSuggestions({ 
  suggestions, 
  overallScore, 
  healthClassification,
  healthReason 
}: HealthSuggestionsProps) {
  const scoreInfo = scoreConfig[overallScore] || scoreConfig["balanced"];
  
  // Normalize healthClassification to handle different casings from API
  const normalizedClassification = healthClassification 
    ? (healthClassification.charAt(0).toUpperCase() + healthClassification.slice(1).toLowerCase()) as keyof typeof healthClassConfig
    : null;
  const healthInfo = normalizedClassification && healthClassConfig[normalizedClassification] 
    ? healthClassConfig[normalizedClassification] 
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      {/* Health Classification Badge */}
      {healthInfo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`mb-6 flex items-center gap-4 rounded-xl border p-4 ${healthInfo.bg} ${healthInfo.border}`}
        >
          <div className={`flex h-14 w-14 items-center justify-center rounded-full ${healthInfo.bg}`}>
            <healthInfo.Icon className={`h-7 w-7 ${healthInfo.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${healthInfo.color}`}>
                {healthInfo.label}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {healthReason || healthInfo.description}
            </p>
          </div>
        </motion.div>
      )}

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
