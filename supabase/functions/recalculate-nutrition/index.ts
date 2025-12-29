import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Ingredient multipliers matching the frontend
const ingredientMultipliers: Record<string, Record<string, number>> = {
  oil: {
    olive: 1.0,
    coconut: 1.05,
    vegetable: 1.0,
    ghee: 1.15,
    none: 0.7,
  },
  flour: {
    wheat: 1.0,
    refined: 1.05,
    millet: 0.9,
    multigrain: 0.95,
    almond: 1.1,
  },
  cooking: {
    deepfried: 1.3,
    panfried: 1.1,
    airfried: 0.85,
    baked: 0.9,
    steamed: 0.8,
    grilled: 0.85,
    boiled: 0.75,
  },
  sugar: {
    sugar: 1.0,
    brown: 0.98,
    honey: 0.95,
    jaggery: 0.9,
    stevia: 0.5,
    none: 0.6,
  },
};

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  tags: string[];
  baseCalories?: number;
  selectedIngredients?: Record<string, string>;
}

interface RecalculateRequest {
  items: FoodItem[];
  originalTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, originalTotals }: RecalculateRequest = await req.json();

    console.log('Recalculating nutrition for', items.length, 'items');

    let totalCaloriesAdjustment = 0;
    const updatedItems = items.map(item => {
      const baseCalories = item.baseCalories || item.calories;
      let multiplier = 1.0;

      if (item.selectedIngredients) {
        for (const [categoryId, optionId] of Object.entries(item.selectedIngredients)) {
          const categoryMultipliers = ingredientMultipliers[categoryId];
          if (categoryMultipliers && categoryMultipliers[optionId]) {
            multiplier *= categoryMultipliers[optionId];
          }
        }
      }

      const adjustedCalories = Math.round(baseCalories * multiplier);
      const calorieDiff = adjustedCalories - baseCalories;
      totalCaloriesAdjustment += calorieDiff;

      return {
        ...item,
        calories: adjustedCalories,
        baseCalories: baseCalories,
      };
    });

    // Adjust macros proportionally based on calorie change
    const calorieRatio = originalTotals.calories > 0 
      ? (originalTotals.calories + totalCaloriesAdjustment) / originalTotals.calories 
      : 1;

    const adjustedTotals = {
      calories: Math.round(originalTotals.calories + totalCaloriesAdjustment),
      protein: Math.round(originalTotals.protein * calorieRatio),
      carbs: Math.round(originalTotals.carbs * calorieRatio),
      fats: Math.round(originalTotals.fats * calorieRatio),
    };

    console.log('Recalculation complete:', adjustedTotals.calories, 'total calories');

    return new Response(
      JSON.stringify({
        items: updatedItems,
        totals: adjustedTotals,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error recalculating nutrition:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
