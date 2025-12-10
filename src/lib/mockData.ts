export interface MealAnalysis {
  id: string;
  date: Date;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  items: {
    name: string;
    quantity: string;
    calories: number;
    tags: string[];
  }[];
  suggestions: {
    type: "positive" | "warning" | "tip";
    text: string;
  }[];
  overallScore: "balanced" | "needs-improvement" | "great";
}

export const mockAnalysisResult: Omit<MealAnalysis, "id" | "date" | "imageUrl"> = {
  calories: 685,
  protein: 32,
  carbs: 78,
  fats: 24,
  items: [
    {
      name: "Grilled Chicken Breast",
      quantity: "150g",
      calories: 248,
      tags: ["High Protein", "Low Calorie"],
    },
    {
      name: "Steamed Rice",
      quantity: "1 cup",
      calories: 206,
      tags: ["High Carbs"],
    },
    {
      name: "Mixed Salad",
      quantity: "1 bowl",
      calories: 45,
      tags: ["Low Calorie", "Fiber Rich", "Vitamin Rich"],
    },
    {
      name: "Olive Oil Dressing",
      quantity: "2 tbsp",
      calories: 119,
      tags: ["High Fat"],
    },
    {
      name: "Cherry Tomatoes",
      quantity: "8 pcs",
      calories: 27,
      tags: ["Low Calorie", "Vitamin Rich"],
    },
    {
      name: "Avocado Slices",
      quantity: "¼ avocado",
      calories: 40,
      tags: ["High Fat", "Fiber Rich"],
    },
  ],
  suggestions: [
    {
      type: "positive",
      text: "Great protein content from the grilled chicken! This helps with muscle recovery and keeps you feeling full.",
    },
    {
      type: "positive",
      text: "Excellent mix of vegetables - keep including colorful veggies for essential vitamins and minerals.",
    },
    {
      type: "tip",
      text: "Consider swapping white rice with brown rice or quinoa for added fiber and nutrients.",
    },
    {
      type: "warning",
      text: "Watch the dressing portion - two tablespoons adds up quickly. Try using lemon juice as an alternative.",
    },
    {
      type: "tip",
      text: "Adding beans or lentils could boost your fiber intake while keeping the meal balanced.",
    },
  ],
  overallScore: "balanced",
};

export const mockMealHistory: MealAnalysis[] = [
  {
    id: "1",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    calories: 520,
    protein: 28,
    carbs: 45,
    fats: 22,
    items: [
      { name: "Quinoa Bowl", quantity: "1 bowl", calories: 220, tags: ["High Protein", "Fiber Rich"] },
      { name: "Grilled Salmon", quantity: "120g", calories: 250, tags: ["High Protein", "High Fat"] },
      { name: "Steamed Broccoli", quantity: "1 cup", calories: 50, tags: ["Low Calorie", "Vitamin Rich"] },
    ],
    suggestions: [
      { type: "positive", text: "Excellent omega-3 intake from salmon!" },
      { type: "tip", text: "Consider adding some citrus for vitamin C." },
    ],
    overallScore: "great",
  },
  {
    id: "2",
    date: new Date(Date.now() - 1000 * 60 * 60 * 8),
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    calories: 380,
    protein: 15,
    carbs: 52,
    fats: 12,
    items: [
      { name: "Fresh Salad", quantity: "1 large bowl", calories: 180, tags: ["Low Calorie", "Fiber Rich"] },
      { name: "Whole Grain Bread", quantity: "2 slices", calories: 160, tags: ["High Carbs", "Fiber Rich"] },
      { name: "Hummus", quantity: "3 tbsp", calories: 40, tags: ["High Protein"] },
    ],
    suggestions: [
      { type: "positive", text: "Great fiber content!" },
      { type: "warning", text: "Could use more protein for a balanced meal." },
    ],
    overallScore: "needs-improvement",
  },
  {
    id: "3",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    calories: 720,
    protein: 35,
    carbs: 85,
    fats: 28,
    items: [
      { name: "Pancakes", quantity: "3 pcs", calories: 400, tags: ["High Carbs"] },
      { name: "Greek Yogurt", quantity: "1 cup", calories: 150, tags: ["High Protein"] },
      { name: "Mixed Berries", quantity: "1 cup", calories: 70, tags: ["Low Calorie", "Vitamin Rich"] },
      { name: "Maple Syrup", quantity: "2 tbsp", calories: 100, tags: ["High Carbs"] },
    ],
    suggestions: [
      { type: "positive", text: "Good protein from Greek yogurt!" },
      { type: "warning", text: "High in simple sugars - consider reducing syrup." },
      { type: "tip", text: "Try whole grain pancakes for added fiber." },
    ],
    overallScore: "needs-improvement",
  },
  {
    id: "4",
    date: new Date(Date.now() - 1000 * 60 * 60 * 32),
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
    calories: 450,
    protein: 22,
    carbs: 48,
    fats: 18,
    items: [
      { name: "Stir-Fry Vegetables", quantity: "2 cups", calories: 150, tags: ["Low Calorie", "Vitamin Rich"] },
      { name: "Tofu", quantity: "150g", calories: 180, tags: ["High Protein"] },
      { name: "Brown Rice", quantity: "½ cup", calories: 120, tags: ["High Carbs", "Fiber Rich"] },
    ],
    suggestions: [
      { type: "positive", text: "Well-balanced vegetarian meal!" },
      { type: "positive", text: "Great choice with brown rice for fiber." },
    ],
    overallScore: "great",
  },
];
