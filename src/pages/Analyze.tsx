import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ImageUploader } from "@/components/analyze/ImageUploader";
import { AnalysisLoader } from "@/components/analyze/AnalysisLoader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type AnalysisState = "idle" | "ready" | "analyzing";

const Analyze = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setSelectedImage(preview);
    setAnalysisState("ready");
  };

  const handleClear = () => {
    setSelectedFile(null);
    setSelectedImage(null);
    setAnalysisState("idle");
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalysisState("analyzing");

    try {
      // Step 1: Detect food items
      const { data, error } = await supabase.functions.invoke('analyze-food', {
        body: { imageBase64: selectedImage }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Check if clarification is needed
      if (data.needsClarification) {
        // Navigate to clarification page
        navigate("/clarify", { 
          state: { 
            imageUrl: selectedImage,
            detectionResult: data
          } 
        });
      } else {
        // No clarification needed - calculate directly
        const { data: nutritionData, error: nutritionError } = await supabase.functions.invoke('calculate-nutrition', {
          body: { 
            items: data.items,
            userAnswers: {}
          }
        });

        if (nutritionError) {
          throw new Error(nutritionError.message);
        }

        if (nutritionData.error) {
          throw new Error(nutritionData.error);
        }

        navigate("/results", { 
          state: { 
            imageUrl: selectedImage,
            analysisResult: nutritionData
          } 
        });
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
      setAnalysisState("ready");
    }
  };

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Analyze Your Meal</h1>
          <p className="mt-2 text-muted-foreground">
            Upload a photo of your plate to get instant AI-powered nutrition insights
          </p>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {analysisState === "analyzing" ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-border bg-card p-8 shadow-card"
            >
              <AnalysisLoader />
            </motion.div>
          ) : (
            <motion.div
              key="uploader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ImageUploader
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onClear={handleClear}
              />

              {/* Action Button */}
              <AnimatePresence>
                {analysisState === "ready" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-6"
                  >
                    <Button onClick={handleAnalyze} size="xl" className="w-full">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Start AI Analysis
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-xl bg-muted/50 p-6"
        >
          <h3 className="mb-3 font-semibold">Tips for Best Results</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Ensure good lighting and a clear view of all food items</li>
            <li>• Include the entire plate in the frame</li>
            <li>• Avoid blurry or dark images</li>
            <li>• Separate food items for better detection</li>
          </ul>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Analyze;
