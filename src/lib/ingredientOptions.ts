// Ingredient variations with calorie multipliers
// A multiplier of 1.0 = baseline, 0.8 = 20% fewer calories, 1.2 = 20% more calories

export interface IngredientOption {
  id: string;
  label: string;
  multiplier: number;
  isHealthy: boolean;
}

export interface IngredientCategory {
  id: string;
  label: string;
  options: IngredientOption[];
}

export const ingredientCategories: IngredientCategory[] = [
  {
    id: "oil",
    label: "Oil Type",
    options: [
      { id: "olive", label: "Olive Oil", multiplier: 1.0, isHealthy: true },
      { id: "coconut", label: "Coconut Oil", multiplier: 1.05, isHealthy: true },
      { id: "vegetable", label: "Vegetable Oil", multiplier: 1.0, isHealthy: false },
      { id: "ghee", label: "Ghee/Butter", multiplier: 1.15, isHealthy: false },
      { id: "none", label: "No Oil", multiplier: 0.7, isHealthy: true },
    ],
  },
  {
    id: "flour",
    label: "Flour Type",
    options: [
      { id: "wheat", label: "Whole Wheat", multiplier: 1.0, isHealthy: true },
      { id: "refined", label: "Refined (Maida)", multiplier: 1.05, isHealthy: false },
      { id: "millet", label: "Millet Flour", multiplier: 0.9, isHealthy: true },
      { id: "multigrain", label: "Multigrain", multiplier: 0.95, isHealthy: true },
      { id: "almond", label: "Almond Flour", multiplier: 1.1, isHealthy: true },
    ],
  },
  {
    id: "cooking",
    label: "Cooking Method",
    options: [
      { id: "deepfried", label: "Deep Fried", multiplier: 1.3, isHealthy: false },
      { id: "panfried", label: "Pan Fried", multiplier: 1.1, isHealthy: false },
      { id: "airfried", label: "Air Fried", multiplier: 0.85, isHealthy: true },
      { id: "baked", label: "Baked", multiplier: 0.9, isHealthy: true },
      { id: "steamed", label: "Steamed", multiplier: 0.8, isHealthy: true },
      { id: "grilled", label: "Grilled", multiplier: 0.85, isHealthy: true },
      { id: "boiled", label: "Boiled", multiplier: 0.75, isHealthy: true },
    ],
  },
  {
    id: "sugar",
    label: "Sweetener",
    options: [
      { id: "sugar", label: "White Sugar", multiplier: 1.0, isHealthy: false },
      { id: "brown", label: "Brown Sugar", multiplier: 0.98, isHealthy: false },
      { id: "honey", label: "Honey", multiplier: 0.95, isHealthy: true },
      { id: "jaggery", label: "Jaggery", multiplier: 0.9, isHealthy: true },
      { id: "stevia", label: "Stevia", multiplier: 0.5, isHealthy: true },
      { id: "none", label: "No Sugar", multiplier: 0.6, isHealthy: true },
    ],
  },
];

// Food-to-category mapping: which ingredient categories apply to which food types
export const foodCategoryMapping: Record<string, string[]> = {
  // Indian breads
  puri: ["oil", "flour", "cooking"],
  roti: ["flour", "oil"],
  paratha: ["flour", "oil", "cooking"],
  naan: ["flour", "oil"],
  chapati: ["flour"],
  bhatura: ["flour", "oil", "cooking"],
  
  // Fried foods
  samosa: ["flour", "oil", "cooking"],
  pakora: ["flour", "oil", "cooking"],
  vada: ["flour", "oil", "cooking"],
  fries: ["oil", "cooking"],
  "french fries": ["oil", "cooking"],
  
  // Rice dishes
  rice: ["oil"],
  biryani: ["oil", "cooking"],
  pulao: ["oil"],
  fried_rice: ["oil", "cooking"],
  
  // Sweets & desserts
  ladoo: ["flour", "sugar", "oil"],
  gulab_jamun: ["flour", "sugar", "oil", "cooking"],
  halwa: ["flour", "sugar", "oil"],
  cake: ["flour", "sugar", "cooking"],
  cookies: ["flour", "sugar", "cooking"],
  
  // General categories
  bread: ["flour"],
  pancake: ["flour", "oil", "cooking", "sugar"],
  dosa: ["oil", "cooking"],
  idli: ["cooking"],
  curry: ["oil"],
  sabzi: ["oil", "cooking"],
};

// Get applicable categories for a food item
export function getApplicableCategories(foodName: string): IngredientCategory[] {
  const lowerName = foodName.toLowerCase();
  
  // Check for exact match first
  if (foodCategoryMapping[lowerName]) {
    return ingredientCategories.filter(cat => 
      foodCategoryMapping[lowerName].includes(cat.id)
    );
  }
  
  // Check for partial matches
  for (const [key, categories] of Object.entries(foodCategoryMapping)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return ingredientCategories.filter(cat => categories.includes(cat.id));
    }
  }
  
  // Default: show oil and cooking method for most foods
  return ingredientCategories.filter(cat => 
    cat.id === "oil" || cat.id === "cooking"
  );
}

// Calculate adjusted calories based on selected ingredients
export function calculateAdjustedCalories(
  baseCalories: number,
  selectedIngredients: Record<string, string>
): { adjustedCalories: number; isHealthier: boolean } {
  let totalMultiplier = 1.0;
  let healthyCount = 0;
  let totalSelections = 0;

  for (const [categoryId, optionId] of Object.entries(selectedIngredients)) {
    const category = ingredientCategories.find(c => c.id === categoryId);
    if (category) {
      const option = category.options.find(o => o.id === optionId);
      if (option) {
        totalMultiplier *= option.multiplier;
        if (option.isHealthy) healthyCount++;
        totalSelections++;
      }
    }
  }

  return {
    adjustedCalories: Math.round(baseCalories * totalMultiplier),
    isHealthier: totalSelections > 0 && healthyCount > totalSelections / 2,
  };
}
