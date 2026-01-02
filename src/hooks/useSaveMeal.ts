import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { FoodItem } from "@/components/results/FoodItemsList";

interface MealData {
  imageUrl: string;
  items: FoodItem[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  healthClassification?: "Healthy" | "Moderate" | "Unhealthy";
  healthScore?: number;
  suggestions?: { type: string; text: string }[];
  selectedIngredients?: Record<string, string>;
}

export const useSaveMeal = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const uploadImage = async (imageBase64: string): Promise<string | null> => {
    if (!user) return null;

    try {
      // Check if it's already a URL (not base64)
      if (imageBase64.startsWith("http")) {
        return imageBase64;
      }

      // Extract base64 data
      const base64Data = imageBase64.split(",")[1] || imageBase64;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("meal-images")
        .upload(fileName, blob);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("meal-images")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const saveMeal = async (mealData: MealData): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save your meals.",
        variant: "destructive",
      });
      return false;
    }

    setIsSaving(true);

    try {
      // Upload image first
      const imageUrl = await uploadImage(mealData.imageUrl);

      // Prepare food items for storage
      const foodItems = mealData.items.map((item) => ({
        name: item.name,
        calories: item.calories,
        quantity: item.quantity,
      }));

      const { error } = await supabase.from("meals").insert({
        user_id: user.id,
        image_url: imageUrl,
        food_items: foodItems,
        selected_ingredients: mealData.selectedIngredients || {},
        calories: mealData.calories,
        protein: mealData.protein,
        carbs: mealData.carbs,
        fats: mealData.fats,
        health_classification: mealData.healthClassification || "Moderate",
        health_score: mealData.healthScore || 50,
        health_suggestions: mealData.suggestions || [],
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Meal Saved!",
        description: "This meal has been added to your history.",
      });
      return true;
    } catch (error) {
      console.error("Failed to save meal:", error);
      toast({
        title: "Save Failed",
        description: "Could not save the meal. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveMeal, isSaving };
};
