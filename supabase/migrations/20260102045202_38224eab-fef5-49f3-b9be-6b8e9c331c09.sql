-- Create enum for health classification
CREATE TYPE public.health_classification AS ENUM ('Healthy', 'Moderate', 'Unhealthy');

-- Create meals table to store food analysis records
CREATE TABLE public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  food_items JSONB NOT NULL DEFAULT '[]',
  selected_ingredients JSONB DEFAULT '{}',
  calories INTEGER NOT NULL DEFAULT 0,
  protein NUMERIC(6,1) NOT NULL DEFAULT 0,
  carbs NUMERIC(6,1) NOT NULL DEFAULT 0,
  fats NUMERIC(6,1) NOT NULL DEFAULT 0,
  health_classification health_classification NOT NULL DEFAULT 'Moderate',
  health_score INTEGER DEFAULT 50,
  health_suggestions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Users can view their own meals
CREATE POLICY "Users can view their own meals"
ON public.meals
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own meals
CREATE POLICY "Users can insert their own meals"
ON public.meals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own meals
CREATE POLICY "Users can delete their own meals"
ON public.meals
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_meals_user_id ON public.meals(user_id);
CREATE INDEX idx_meals_created_at ON public.meals(created_at DESC);

-- Create storage bucket for meal images
INSERT INTO storage.buckets (id, name, public) VALUES ('meal-images', 'meal-images', true);

-- Storage policies for meal images
CREATE POLICY "Users can upload meal images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'meal-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Meal images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'meal-images');

CREATE POLICY "Users can delete their own meal images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'meal-images' AND auth.uid()::text = (storage.foldername(name))[1]);