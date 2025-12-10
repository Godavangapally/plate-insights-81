import { motion } from "framer-motion";
import { Calendar, Flame, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { mockMealHistory } from "@/lib/mockData";
import { format, formatDistanceToNow } from "date-fns";

const History = () => {
  const totalCalories = mockMealHistory.reduce((sum, meal) => sum + meal.calories, 0);
  const avgCalories = Math.round(totalCalories / mockMealHistory.length);

  return (
    <PageWrapper>
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Meal History</h1>
          <p className="mt-2 text-muted-foreground">
            Track your nutrition journey over time
          </p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Meals</p>
            <p className="text-2xl font-bold">{mockMealHistory.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Avg Calories</p>
            <p className="text-2xl font-bold">{avgCalories}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold">{mockMealHistory.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Streak</p>
            <p className="text-2xl font-bold">3 days</p>
          </div>
        </motion.div>

        {/* Meal List */}
        <div className="space-y-4">
          {mockMealHistory.map((meal, index) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to="/results"
                state={{ imageUrl: meal.imageUrl }}
                className="group block"
              >
                <div className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-card hover:-translate-y-0.5">
                  {/* Image */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl md:h-32 md:w-32">
                    <img
                      src={meal.imageUrl}
                      alt="Meal"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div
                      className={`absolute bottom-1 right-1 h-3 w-3 rounded-full ${
                        meal.overallScore === "great"
                          ? "bg-success"
                          : meal.overallScore === "balanced"
                          ? "bg-primary"
                          : "bg-warning"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(meal.date, { addSuffix: true })}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {meal.items.slice(0, 3).map((item) => (
                          <span
                            key={item.name}
                            className="rounded-full bg-muted px-2 py-0.5 text-xs"
                          >
                            {item.name}
                          </span>
                        ))}
                        {meal.items.length > 3 && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                            +{meal.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Macros */}
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-accent" />
                        <span className="font-semibold">{meal.calories}</span>
                        <span className="text-xs text-muted-foreground">kcal</span>
                      </div>
                      <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fats}g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State - shown if no history */}
        {mockMealHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <Calendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No meals yet</h3>
            <p className="mb-6 text-muted-foreground">
              Start tracking your nutrition by analyzing your first meal
            </p>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.02]"
            >
              Analyze a Meal
            </Link>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
};

export default History;
