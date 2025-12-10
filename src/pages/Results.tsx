import { motion } from "framer-motion";
import { ArrowLeft, Share2, Bookmark, RotateCcw } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { NutritionCard } from "@/components/results/NutritionCard";
import { FoodItemsList } from "@/components/results/FoodItemsList";
import { HealthSuggestions } from "@/components/results/HealthSuggestions";
import { Button } from "@/components/ui/button";
import { mockAnalysisResult } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";

const Results = () => {
  const location = useLocation();
  const imageUrl = location.state?.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop";

  const handleSave = () => {
    toast({
      title: "Meal Saved!",
      description: "This meal has been added to your history.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Link Copied!",
      description: "You can now share your meal analysis.",
    });
  };

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
            <Button variant="default" size="sm" onClick={handleSave}>
              <Bookmark className="mr-2 h-4 w-4" />
              Save Meal
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

        {/* Results Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <NutritionCard
              calories={mockAnalysisResult.calories}
              protein={mockAnalysisResult.protein}
              carbs={mockAnalysisResult.carbs}
              fats={mockAnalysisResult.fats}
            />
            <HealthSuggestions
              suggestions={mockAnalysisResult.suggestions}
              overallScore={mockAnalysisResult.overallScore}
            />
          </div>
          <div>
            <FoodItemsList items={mockAnalysisResult.items} />
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
