import { useState } from "react";
import { motion } from "framer-motion";
import { User, Target, Leaf, Bell, ChevronRight, Check } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const goals = [
  { id: "lose", label: "Lose Weight", description: "Calorie deficit focus" },
  { id: "maintain", label: "Maintain Weight", description: "Balanced nutrition" },
  { id: "gain", label: "Build Muscle", description: "High protein focus" },
];

const diets = [
  { id: "any", label: "No Preference", icon: "🍽️" },
  { id: "veg", label: "Vegetarian", icon: "🥬" },
  { id: "vegan", label: "Vegan", icon: "🌱" },
  { id: "keto", label: "Keto", icon: "🥑" },
];

const Profile = () => {
  const [selectedGoal, setSelectedGoal] = useState("maintain");
  const [selectedDiet, setSelectedDiet] = useState("any");

  const handleSave = () => {
    toast({
      title: "Preferences Saved!",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Personalize your nutrition experience
          </p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Guest User</h2>
              <p className="text-sm text-muted-foreground">
                Set up your profile for personalized insights
              </p>
            </div>
          </div>
        </motion.div>

        {/* Goals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Your Goal</h3>
              <p className="text-sm text-muted-foreground">
                What are you trying to achieve?
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  selectedGoal === goal.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div>
                  <p className="font-medium">{goal.label}</p>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                {selectedGoal === goal.id && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Diet Preference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <Leaf className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">Diet Preference</h3>
              <p className="text-sm text-muted-foreground">
                Help us tailor suggestions to your diet
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {diets.map((diet) => (
              <button
                key={diet.id}
                onClick={() => setSelectedDiet(diet.id)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                  selectedDiet === diet.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-2xl">{diet.icon}</span>
                <span className="font-medium">{diet.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Settings Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 rounded-2xl border border-border bg-card shadow-card"
        >
          <button className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Notifications</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={handleSave} size="lg" className="w-full">
            Save Preferences
          </Button>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Profile;
