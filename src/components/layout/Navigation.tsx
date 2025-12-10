import { NavLink as RouterNavLink } from "react-router-dom";
import { Home, Camera, History, User, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/analyze", icon: Camera, label: "Analyze" },
  { to: "/history", icon: History, label: "History" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function Navigation() {
  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:top-0 md:bottom-auto md:py-4"
    >
      <div className="mx-auto max-w-lg md:max-w-4xl">
        <div className="glass rounded-2xl border border-border/50 p-2 shadow-card">
          <div className="flex items-center justify-between md:justify-center md:gap-2">
            {/* Logo - desktop only */}
            <div className="hidden md:flex items-center gap-2 px-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
                <Utensils className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">NutriPlate</span>
            </div>

            <div className="flex flex-1 items-center justify-around md:justify-center md:gap-1 md:flex-none">
              {navItems.map((item) => (
                <RouterNavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "relative flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-300 md:flex-row md:gap-2 md:text-sm",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute inset-0 rounded-xl bg-primary/10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <item.icon className="relative z-10 h-5 w-5" />
                      <span className="relative z-10">{item.label}</span>
                    </>
                  )}
                </RouterNavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
