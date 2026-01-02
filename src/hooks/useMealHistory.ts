import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface MealRecord {
  id: string;
  image_url: string | null;
  food_items: { name: string; calories: number; portion: string }[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  health_classification: "Healthy" | "Moderate" | "Unhealthy";
  health_score: number;
  created_at: string;
}

export const useMealHistory = () => {
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMeals = async () => {
    if (!user) {
      setMeals([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("meals")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Type cast the data to handle JSONB fields
      const typedMeals: MealRecord[] = (data || []).map((meal) => ({
        id: meal.id,
        image_url: meal.image_url,
        food_items: (meal.food_items as { name: string; calories: number; portion: string }[]) || [],
        calories: meal.calories,
        protein: Number(meal.protein),
        carbs: Number(meal.carbs),
        fats: Number(meal.fats),
        health_classification: meal.health_classification as "Healthy" | "Moderate" | "Unhealthy",
        health_score: meal.health_score || 50,
        created_at: meal.created_at,
      }));

      setMeals(typedMeals);
    } catch (err) {
      console.error("Failed to fetch meals:", err);
      setError("Could not load meal history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMeal = async (mealId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("meals").delete().eq("id", mealId);

      if (error) {
        throw error;
      }

      setMeals((prev) => prev.filter((meal) => meal.id !== mealId));
      return true;
    } catch (err) {
      console.error("Failed to delete meal:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [user]);

  return { meals, isLoading, error, refetch: fetchMeals, deleteMeal };
};
