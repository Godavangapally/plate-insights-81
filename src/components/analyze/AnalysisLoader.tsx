import { motion } from "framer-motion";
import { Scan, Utensils, ChartPie, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const stages = [
  { icon: Scan, text: "Scanning your plate..." },
  { icon: Utensils, text: "Detecting food items..." },
  { icon: ChartPie, text: "Calculating nutrition..." },
  { icon: Sparkles, text: "Generating insights..." },
];

export function AnalysisLoader() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = stages[currentStage].icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="relative mb-8">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          style={{ width: 120, height: 120 }}
        />
        
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-dashed border-primary/40"
        />

        {/* Center icon */}
        <motion.div
          key={currentStage}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="flex h-[120px] w-[120px] items-center justify-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <CurrentIcon className="h-8 w-8 text-primary-foreground" />
          </div>
        </motion.div>
      </div>

      <motion.p
        key={stages[currentStage].text}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-medium"
      >
        {stages[currentStage].text}
      </motion.p>

      <p className="mt-2 text-sm text-muted-foreground">
        This usually takes a few seconds
      </p>

      {/* Progress dots */}
      <div className="mt-6 flex gap-2">
        {stages.map((_, index) => (
          <motion.div
            key={index}
            animate={{
              scale: index === currentStage ? 1.2 : 1,
              backgroundColor:
                index === currentStage
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted))",
            }}
            className="h-2 w-2 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}
