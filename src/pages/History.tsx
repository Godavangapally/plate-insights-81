import { motion } from "framer-motion";
import { Calendar, Flame, Clock, Trash2, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useMealHistory } from "@/hooks/useMealHistory";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const History = () => {
  const { meals, isLoading, error, deleteMeal } = useMealHistory();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const avgCalories = meals.length > 0 ? Math.round(totalCalories / meals.length) : 0;

  const handleDelete = async (mealId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingId(mealId);
    
    const success = await deleteMeal(mealId);
    if (success) {
      toast({
        title: "Meal Deleted",
        description: "The meal has been removed from your history.",
      });
    } else {
      toast({
        title: "Delete Failed",
        description: "Could not delete the meal. Please try again.",
        variant: "destructive",
      });
    }
    setDeletingId(null);
  };

  const getHealthColor = (classification: string) => {
    switch (classification) {
      case "Healthy":
        return "bg-success";
      case "Moderate":
        return "bg-primary";
      case "Unhealthy":
        return "bg-warning";
      default:
        return "bg-muted";
    }
  };

  if (!user) {
    return (
      <PageWrapper>
        <div className="mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <Calendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">Sign in to view your history</h3>
            <p className="mb-6 text-muted-foreground">
              Create an account to save and track your meal analyses
            </p>
            <Button onClick={() => navigate("/auth")}>
              Sign In / Sign Up
            </Button>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="mx-auto max-w-4xl px-4">
          <div className="py-16 text-center">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

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

        {meals.length > 0 && (
          <>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4"
            >
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">Total Meals</p>
                <p className="text-2xl font-bold">{meals.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">Avg Calories</p>
                <p className="text-2xl font-bold">{avgCalories}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">Total Calories</p>
                <p className="text-2xl font-bold">{totalCalories.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">Healthy Meals</p>
                <p className="text-2xl font-bold">
                  {meals.filter(m => m.health_classification === "Healthy").length}
                </p>
              </div>
            </motion.div>

            {/* Meal List */}
            <div className="space-y-4">
              {meals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group block"
                >
                  <div className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-card hover:-translate-y-0.5">
                    {/* Image */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl md:h-32 md:w-32">
                      {meal.image_url ? (
                        <img
                          src={meal.image_url}
                          alt="Meal"
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <Calendar className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div
                        className={`absolute bottom-1 right-1 h-3 w-3 rounded-full ${getHealthColor(meal.health_classification)}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(meal.created_at), { addSuffix: true })}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {meal.food_items.slice(0, 3).map((item, idx) => (
                            <span
                              key={`${item.name}-${idx}`}
                              className="rounded-full bg-muted px-2 py-0.5 text-xs"
                            >
                              {item.name}
                            </span>
                          ))}
                          {meal.food_items.length > 3 && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                              +{meal.food_items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Macros */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(meal.id, e)}
                          disabled={deletingId === meal.id}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          {deletingId === meal.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {meals.length === 0 && (
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
