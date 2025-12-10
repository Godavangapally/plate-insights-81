import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export function ImageUploader({ onImageSelect, selectedImage, onClear }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        processFile(files[0]);
      }
    },
    [onImageSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        onImageSelect(file, preview);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {selectedImage ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-card"
          >
            <img
              src={selectedImage}
              alt="Selected food"
              className="h-64 w-full object-cover md:h-80"
            />
            <button
              onClick={onClear}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 text-foreground shadow-lg transition-all hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card/90 to-transparent p-4">
              <p className="text-sm font-medium">Image ready for analysis</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="uploader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "relative flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-300 md:min-h-80",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <ImageIcon className="h-10 w-10 text-primary" />
            </div>

            <h3 className="mb-2 text-lg font-semibold">Upload Your Plate Photo</h3>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Drag and drop an image here, or use the buttons below
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <Button variant="default" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </span>
                </Button>
              </label>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <Button variant="outline" asChild>
                  <span>
                    <Camera className="mr-2 h-4 w-4" />
                    Use Camera
                  </span>
                </Button>
              </label>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Supports JPG, PNG, WebP up to 10MB
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
