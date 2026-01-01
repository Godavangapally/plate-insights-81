# 🍽️ NutriPlate - AI-Powered Food Analysis

<p align="center">
  <strong>Know your plate. Track your health.</strong>
</p>

<p align="center">
  Upload a photo of your meal and get instant AI-powered nutrition analysis with calorie counts, macro breakdowns, and personalized health insights.
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

NutriPlate is an intelligent nutrition analysis application that uses AI to identify food items from images and provide accurate nutritional information. Unlike traditional calorie counters that rely on manual input, NutriPlate understands that the same dish can be prepared in many different ways with varying nutritional values.

### The Problem We Solve

A simple "fried rice" can vary from 300 to 600+ calories depending on:
- Type of oil used (olive oil vs. butter vs. coconut oil)
- Cooking method (stir-fried vs. deep-fried)
- Ingredients (white rice vs. brown rice)

NutriPlate asks the right questions to give you accurate results.

---

## ✨ Features

### 🔍 AI-Powered Food Recognition
Upload any food image and our AI instantly identifies all food items, portions, and ingredients.

### 💬 Smart Clarification System
The app intelligently asks relevant questions about:
- **Cooking Method** - Deep fried, shallow fried, baked, air-fried, steamed
- **Oil/Fat Type** - Olive oil, vegetable oil, butter, ghee, coconut oil
- **Flour Type** - All-purpose, whole wheat, almond flour
- **Sweetener Used** - White sugar, honey, stevia, jaggery

### 📊 Accurate Nutrition Calculation
Based on your answers, get precise calculations for:
- Total Calories
- Protein (g)
- Carbohydrates (g)
- Fats (g)

### 🏥 Health Classification
Each meal is classified with clear visual indicators:
- 🟢 **Healthy** - Nutritious choices with balanced macros
- 🟡 **Moderate** - Acceptable but could be improved
- 🔴 **Unhealthy** - High in calories, fats, or sugars

### 🔄 Interactive Ingredient Modification
Don't like the results? Modify ingredients on the results page and instantly recalculate nutrition values.

### 💡 Personalized Health Suggestions
Receive AI-generated tips to make your meals healthier without sacrificing taste.

---

## 🔄 How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  1. Upload      │────▶│  2. AI Analysis  │────▶│  3. Clarify     │
│  Food Image     │     │  (Detect Items)  │     │  Ingredients    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  6. Get Health  │◀────│  5. View Full    │◀────│  4. Calculate   │
│  Suggestions    │     │  Results         │     │  Nutrition      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Step-by-Step Process

1. **Upload Image** - Take a photo or upload an existing image of your meal
2. **AI Detection** - Our AI identifies all food items and their approximate portions
3. **Smart Questions** - Answer quick questions about how the food was prepared
4. **Calculation** - Nutrition is calculated based on actual ingredients used
5. **Results** - View detailed breakdown with calories, macros, and health score
6. **Suggestions** - Get personalized tips to improve your meal's nutritional value

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Animations** | Framer Motion |
| **Backend** | Supabase Edge Functions (Deno) |
| **AI/ML** | Lovable AI (Gemini/GPT models) |
| **State Management** | React Query, React Router |
| **UI Components** | Radix UI Primitives |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Lovable account (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd nutriplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Environment Variables

The following environment variables are automatically configured when using Lovable Cloud:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anonymous key |
| `LOVABLE_API_KEY` | API key for AI features |

---

## 📁 Project Structure

```
nutriplate/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── analyze/         # Image upload & analysis components
│   │   ├── home/            # Landing page sections
│   │   ├── layout/          # Navigation & page wrappers
│   │   ├── results/         # Nutrition display components
│   │   └── ui/              # Reusable UI components (shadcn)
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # Supabase client configuration
│   ├── lib/                 # Utilities & helper functions
│   ├── pages/               # Route components
│   │   ├── Index.tsx        # Home page
│   │   ├── Analyze.tsx      # Image upload page
│   │   ├── ClarifyIngredients.tsx  # Q&A page
│   │   ├── Results.tsx      # Nutrition results page
│   │   ├── History.tsx      # Past analyses
│   │   └── Profile.tsx      # User profile
│   ├── App.tsx              # Main app component with routing
│   └── main.tsx             # Application entry point
├── supabase/
│   └── functions/           # Edge functions
│       ├── analyze-food/    # AI food detection
│       ├── calculate-nutrition/    # Nutrition calculation
│       └── recalculate-nutrition/  # Ingredient modification
└── README.md
```

---

## 📡 API Reference

### Edge Functions

#### `analyze-food`
Analyzes an uploaded food image to detect items and generate clarification questions.

**Request:**
```json
{
  "imageBase64": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "needsClarification": true,
  "items": [
    {
      "name": "Fried Rice",
      "quantity": "1 plate",
      "estimatedCalories": 450,
      "clarificationQuestions": [
        {
          "id": "oil_type",
          "question": "What type of oil was used?",
          "options": ["Vegetable Oil", "Olive Oil", "Butter"]
        }
      ]
    }
  ]
}
```

#### `calculate-nutrition`
Calculates detailed nutrition based on food items and user answers.

**Request:**
```json
{
  "items": [...],
  "userAnswers": {
    "oil_type": "Olive Oil",
    "cooking_method": "Stir-fried"
  }
}
```

**Response:**
```json
{
  "totalCalories": 420,
  "totalProtein": 12,
  "totalCarbs": 58,
  "totalFats": 16,
  "healthClassification": "Moderate",
  "healthReason": "Good protein content but high in refined carbs",
  "suggestions": [...]
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

---

<p align="center">
  Made with ❤️ for healthier eating habits
</p>
