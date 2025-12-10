import { motion } from "framer-motion";
import { Apple, Flame, Leaf, Target, TrendingUp, Zap } from "lucide-react";

const features = [
  {
    icon: Flame,
    title: "Calorie Tracking",
    description: "Accurate calorie estimation for every meal",
  },
  {
    icon: Target,
    title: "Macro Breakdown",
    description: "Track carbs, protein, and fats easily",
  },
  {
    icon: Leaf,
    title: "Health Insights",
    description: "Personalized tips for better nutrition",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your nutrition journey over time",
  },
  {
    icon: Apple,
    title: "Food Detection",
    description: "AI identifies multiple food items instantly",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get analysis in seconds, not minutes",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-secondary/30 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Everything You Need
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Powerful features to help you understand and improve your eating habits
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group flex items-start gap-4 rounded-xl bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-card"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
