"use client";

import { motion } from "framer-motion";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  isLoading?: boolean;
}

/**
 * StreakCard Component
 * 
 * Displays GitHub contribution streak metrics with animated numbers
 * and loading skeleton states. Matches the portfolio's dark/terminal aesthetic.
 * 
 * **Validates: Requirements 1.2, 1.3, 1.4, 10.1, 10.2, 11.1, 11.2, 11.3, 11.4**
 */
export default function StreakCard({
  currentStreak,
  longestStreak,
  totalContributions,
  isLoading = false,
}: StreakCardProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.7)] overflow-hidden p-6">
        {/* Loading skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.7)] overflow-hidden p-6">
      {/* Card Title */}
      <h3 className="text-lg md:text-xl font-semibold mb-6 text-white">
        Contribution Streak
      </h3>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Streak */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2"
          >
            <AnimatedNumber value={currentStreak} />
          </motion.div>
          <span className="text-sm text-slate-400 uppercase tracking-wider">
            Current Streak (days)
          </span>
        </div>

        {/* Longest Streak */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-blue-400 mb-2"
          >
            <AnimatedNumber value={longestStreak} />
          </motion.div>
          <span className="text-sm text-slate-400 uppercase tracking-wider">
            Longest Streak (days)
          </span>
        </div>

        {/* Total Contributions */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-fuchsia-400 mb-2"
          >
            <AnimatedNumber value={totalContributions} />
          </motion.div>
          <span className="text-sm text-slate-400 uppercase tracking-wider">
            Total Contributions
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * AnimatedNumber Component
 * 
 * Animates a number from 0 to its target value on mount
 * using Framer Motion's animation capabilities
 */
function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          duration: 0.8,
        }}
      >
        {value}
      </motion.span>
    </motion.span>
  );
}
