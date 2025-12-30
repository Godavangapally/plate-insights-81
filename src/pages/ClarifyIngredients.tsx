import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChefHat, Sparkles, Check } from "lucide-react";
import { Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ClarificationOption {
  id: string;
  label: string;
  isDefault?: boolean;
}

interface ClarificationQuestion {
  questionId: string;
  question: string;
  options: ClarificationOption[];
}

interface DetectedItem {
  name: string;
  quantity: string;
  needsClarification: boolean;
  clarificationQuestions?: ClarificationQuestion[];
}

interface DetectionResult {
  items: DetectedItem[];
  mealDescription: string;
  needsClarification: boolean;
}

const ClarifyIngredients = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const imageUrl = location.state?.imageUrl as string | undefined;
  const detectionResult = location.state?.detectionResult as DetectionResult | undefined;
  
  const [userAnswers, setUserAnswers] = useState<Record<number, Record<string, string>>>(() => {
    // Initialize with default answers
    const defaults: Record<number, Record<string, string>> = {};
    detectionResult?.items.forEach((item, index) => {
      if (item.clarificationQuestions) {
        defaults[index] = {};
        item.clarificationQuestions.forEach(q => {
          const defaultOption = q.options.find(o => o.isDefault);
          if (defaultOption) {
            defaults[index][q.questionId] = defaultOption.id;
          }
        });
      }
    });
    return defaults;
  });
  
  const [isCalculating, setIsCalculating] = useState(false);

  // Redirect if no detection data
  if (!detectionResult || !imageUrl) {
    return <Navigate to="/analyze" replace />;
  }

  const handleOptionSelect = (itemIndex: number, questionId: string, optionId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        [questionId]: optionId,
      },
    }));
  };

  const handleCalculate = async () => {
    setIsCalculating(true);

    try {
      const { data, error } = await supabase.functions.invoke('calculate-nutrition', {
        body: {
          items: detectionResult.items,
          userAnswers,
        },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      navigate("/results", {
        state: {
          imageUrl,
          analysisResult: data,
        },
      });
    } catch (error) {
      console.error("Calculation failed:", error);
      toast({
        title: "Calculation Failed",
        description: error instanceof Error ? error.message : "Failed to calculate nutrition. Please try again.",
        variant: "destructive",
      });
      setIsCalculating(false);
    }
  };

  const itemsWithQuestions = detectionResult.items.filter(item => item.needsClarification);
  const itemsWithoutQuestions = detectionResult.items.filter(item => !item.needsClarification);

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/analyze"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Analyze
          </Link>
          <h1 className="text-2xl font-bold">Customize Your Meal</h1>
          <p className="mt-2 text-muted-foreground">
            Tell us how your food was prepared for accurate nutrition estimates
          </p>
        </div>

        {/* Meal Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 overflow-hidden rounded-xl border border-border"
        >
          <img
            src={imageUrl}
            alt="Your meal"
            className="h-40 w-full object-cover"
          />
          <div className="bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ChefHat className="h-4 w-4" />
              <span>{detectionResult.mealDescription}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {detectionResult.items.map((item, i) => (
                <Badge key={i} variant="secondary">
                  {item.name} ({item.quantity})
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Clarification Questions */}
        {itemsWithQuestions.length > 0 && (
          <div className="space-y-6">
            {itemsWithQuestions.map((item, itemIndex) => {
              const actualIndex = detectionResult.items.indexOf(item);
              return (
                <motion.div
                  key={actualIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: itemIndex * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="border-b border-border bg-muted/50 px-4 py-3">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.quantity}</p>
                    </div>
                    <div className="space-y-4 p-4">
                      {item.clarificationQuestions?.map((question) => (
                        <div key={question.questionId}>
                          <p className="mb-3 text-sm font-medium">{question.question}</p>
                          <div className="flex flex-wrap gap-2">
                            {question.options.map((option) => {
                              const isSelected = userAnswers[actualIndex]?.[question.questionId] === option.id;
                              return (
                                <button
                                  key={option.id}
                                  onClick={() => handleOptionSelect(actualIndex, question.questionId, option.id)}
                                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                                  }`}
                                >
                                  {isSelected && <Check className="h-3 w-3" />}
                                  {option.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Items without questions */}
        {itemsWithoutQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 rounded-xl bg-muted/50 p-4"
          >
            <p className="text-sm text-muted-foreground">
              <strong>Standard items:</strong> {itemsWithoutQuestions.map(i => i.name).join(", ")}
            </p>
          </motion.div>
        )}

        {/* Calculate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            size="xl"
            className="w-full"
          >
            {isCalculating ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                Calculating Nutrition...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Calculate Nutrition
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default ClarifyIngredients;
