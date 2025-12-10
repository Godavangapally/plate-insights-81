import { motion } from "framer-motion";
import { Camera, Cpu, PieChart } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Upload Photo",
    description: "Take a photo of your plate or upload from your gallery",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Cpu,
    title: "AI Analysis",
    description: "Our AI detects food items and estimates quantities",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: PieChart,
    title: "Get Insights",
    description: "View detailed nutrition breakdown and health tips",
    color: "bg-success/10 text-success",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function HowItWorksSection() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
          <p className="text-muted-foreground">Three simple steps to better nutrition</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-3"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative rounded-2xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Step number */}
                <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>

                <div className={`mb-6 inline-flex rounded-2xl p-4 ${step.color}`}>
                  <step.icon className="h-8 w-8" />
                </div>

                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-0.5 w-6 -translate-y-1/2 translate-x-full bg-border md:block" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
