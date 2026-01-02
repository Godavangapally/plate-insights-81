import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Bookmark, RotateCcw, RefreshCw, Loader2 } from "lucide-react";
import { Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { NutritionCard } from "@/components/results/NutritionCard";
import { FoodItemsList, type FoodItem } from "@/components/results/FoodItemsList";
import { HealthSuggestions } from "@/components/results/HealthSuggestions";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSaveMeal } from "@/hooks/useSaveMeal";
import { useAuth } from "@/contexts/AuthContext";

interface AnalysisResult {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  items: FoodItem[];
  suggestions: {
    type: "positive" | "warning" | "tip";
    text: string;
  }[];
  overallScore: "balanced" | "needs-improvement" | "great";
  healthClassification?: "Healthy" | "Moderate" | "Unhealthy";
  healthReason?: string;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imageUrl = location.state?.imageUrl;
  const initialResult: AnalysisResult | undefined = location.state?.analysisResult;
  const { user } = useAuth();
  const { saveMeal, isSaving } = useSaveMeal();

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    initialResult || null
  );
  const [originalTotals, setOriginalTotals] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  } | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Store original totals on mount
  useEffect(() => {
    if (initialResult && !originalTotals) {
      setOriginalTotals({
        calories: initialResult.calories,
        protein: initialResult.protein,
        carbs: initialResult.carbs,
        fats: initialResult.fats,
      });
      // Initialize baseCalories for all items
      setAnalysisResult({
        ...initialResult,
        items: initialResult.items.map(item => ({
          ...item,
          baseCalories: item.calories,
          selectedIngredients: {},
        })),
      });
    }
  }, [initialResult, originalTotals]);

  // Redirect to analyze page if no data
  if (!initialResult) {
    return <Navigate to="/analyze" replace />;
  }

  const handleIngredientChange = useCallback(
    (itemIndex: number, categoryId: string, optionId: string) => {
      setAnalysisResult(prev => {
        if (!prev) return prev;
        
        const newItems = [...prev.items];
        const item = { ...newItems[itemIndex] };
        item.selectedIngredients = {
          ...item.selectedIngredients,
          [categoryId]: optionId,
        };
        newItems[itemIndex] = item;
        
        return { ...prev, items: newItems };
      });
      setHasChanges(true);
    },
    []
  );

  const handleRecalculate = async () => {
    if (!analysisResult || !originalTotals) return;

    setIsRecalculating(true);

    try {
      const { data, error } = await supabase.functions.invoke('recalculate-nutrition', {
        body: {
          items: analysisResult.items,
          originalTotals,
        },
      });

      if (error) throw new Error(error.message);

      setAnalysisResult(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          items: data.items,
          calories: data.totals.calories,
          protein: data.totals.protein,
          carbs: data.totals.carbs,
          fats: data.totals.fats,
        };
      });

      setHasChanges(false);
      toast({
        title: "Nutrition Updated!",
        description: "Calories recalculated based on your ingredient selections.",
      });
    } catch (error) {
      console.error("Recalculation failed:", error);
      toast({
        title: "Recalculation Failed",
        description: "Could not update nutrition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleSave = async () => {
    if (!analysisResult) return;

    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save your meals.",
      });
      navigate("/auth");
      return;
    }

    const success = await saveMeal({
      imageUrl,
      items: analysisResult.items,
      calories: analysisResult.calories,
      protein: analysisResult.protein,
      carbs: analysisResult.carbs,
      fats: analysisResult.fats,
      healthClassification: analysisResult.healthClassification,
      suggestions: analysisResult.suggestions,
    });

    if (success) {
      setIsSaved(true);
    }
  };

  const handleShare = () => {
    toast({
      title: "Share Link Copied!",
      description: "You can now share your meal analysis.",
    });
  };

  if (!analysisResult) {
    return <Navigate to="/analyze" replace />;
  }

  return (
    <PageWrapper>
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Analyze Another
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isSaving || isSaved}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Bookmark className="mr-2 h-4 w-4" />
              )}
              {isSaved ? "Saved!" : "Save Meal"}
            </Button>
          </div>
        </div>

        {/* Analyzed Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 overflow-hidden rounded-2xl border border-border shadow-card"
        >
          <img
            src={imageUrl}
            alt="Analyzed meal"
            className="h-48 w-full object-cover md:h-64"
          />
        </motion.div>

        {/* Recalculate Banner */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4"
          >
            <p className="text-sm text-foreground">
              You've customized ingredients. Recalculate to update nutrition values.
            </p>
            <Button
              onClick={handleRecalculate}
              disabled={isRecalculating}
              size="sm"
            >
              {isRecalculating ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Recalculate
            </Button>
          </motion.div>
        )}

        {/* Results Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <NutritionCard
              calories={analysisResult.calories}
              protein={analysisResult.protein}
              carbs={analysisResult.carbs}
              fats={analysisResult.fats}
            />
            <HealthSuggestions
              suggestions={analysisResult.suggestions}
              overallScore={analysisResult.overallScore}
              healthClassification={analysisResult.healthClassification}
              healthReason={analysisResult.healthReason}
            />
          </div>
          <div>
            <FoodItemsList
              items={analysisResult.items}
              onIngredientChange={handleIngredientChange}
              isRecalculating={isRecalculating}
            />
          </div>
        </div>

        {/* Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Button asChild variant="outline" size="lg">
            <Link to="/analyze">
              <RotateCcw className="mr-2 h-4 w-4" />
              Analyze Another Meal
            </Link>
          </Button>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Results;
