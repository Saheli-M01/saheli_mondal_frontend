"use client";

import { motion } from "framer-motion";
import { CommitInfo } from "@/lib/github/types";

interface RecentCommitsCardProps {
  commits: CommitInfo[];
  isLoading?: boolean;
}

/**
 * RecentCommitsCard Component
 * 
 * Displays up to 5 recent GitHub commits with message, repo, timestamp,
 * and clickable links. Includes loading skeleton states and matches the
 * portfolio's dark/terminal aesthetic.
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 10.1, 10.2, 11.1, 11.2, 11.4, 11.5**
 */
export default function RecentCommitsCard({
  commits,
  isLoading = false,
}: RecentCommitsCardProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.7)] overflow-hidden p-6">
        {/* Loading skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2 p-3 border border-white/5 rounded-lg">
                <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                <div className="flex gap-3">
                  <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.7)] overflow-hidden p-6">
      {/* Card Title */}
      <h3 className="text-lg md:text-xl font-semibold mb-6 text-white">
        Recent Commits
      </h3>

      {/* Commits List */}
      <div className="space-y-3">
        {commits.length === 0 ? (
          <p className="text-slate-400 text-sm">No recent commits found.</p>
        ) : (
          commits.map((commit, index) => (
            <motion.a
              key={commit.sha}
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="block p-3 rounded-lg border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all duration-200 group"
            >
              {/* Commit Message */}
              <p className="text-white text-sm md:text-base mb-2 group-hover:text-emerald-400 transition-colors">
                {truncateMessage(commit.message, 60)}
              </p>

              {/* Repo and Timestamp */}
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="font-mono">{commit.repo}</span>
                <span>•</span>
                <span>{formatRelativeTime(commit.timestamp)}</span>
              </div>
            </motion.a>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Truncates a commit message to the specified length and adds ellipsis
 * 
 * @param message - The commit message to truncate
 * @param maxLength - Maximum length before truncation (default: 60)
 * @returns Truncated message with ellipsis if needed
 * 
 * **Validates: Requirement 11.5**
 */
function truncateMessage(message: string, maxLength: number = 60): string {
  if (message.length <= maxLength) {
    return message;
  }
  return message.substring(0, maxLength) + "...";
}

/**
 * Formats an ISO 8601 timestamp as relative time (e.g., "2 hours ago")
 * 
 * @param timestamp - ISO 8601 timestamp string
 * @returns Human-readable relative time string
 * 
 * **Validates: Requirement 2.4**
 */
function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
  } else {
    return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
  }
}
