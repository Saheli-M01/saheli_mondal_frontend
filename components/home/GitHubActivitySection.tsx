"use client";

import { useEffect, useState, useRef } from "react";
import { fetchUserActivity } from "@/lib/github/api";
import { GitHubActivityData, APIError } from "@/lib/github/types";
import StreakCard from "./StreakCard";
import RecentCommitsCard from "./RecentCommitsCard";

interface GitHubActivitySectionProps {
  username: string;
  className?: string;
}

/**
 * GitHubActivitySection Component
 * 
 * Main orchestrator component that fetches GitHub activity data and displays
 * contribution streaks and recent commits. Handles loading, error, and success
 * states with appropriate UI feedback. Implements exponential backoff for
 * network errors and graceful rate limit handling.
 * 
 * **Validates: Requirements 1.1, 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4, 6.5,
 *              10.1, 10.2, 10.3, 10.4, 10.5, 13.1, 13.2, 13.3, 13.4, 13.5**
 */
export default function GitHubActivitySection({
  username,
  className = "",
}: GitHubActivitySectionProps) {
  const [data, setData] = useState<GitHubActivityData | null>(null);
  const [error, setError] = useState<APIError | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const isMountedRef = useRef(true);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch data function with exponential backoff support
  const fetchData = async (isRetry: boolean = false) => {
    // Don't fetch if component is unmounted
    if (!isMountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const activityData = await fetchUserActivity(username);
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setData(activityData);
        setError(null);
        setRetryCount(0); // Reset retry count on success
      }
    } catch (err) {
      // Only update state if component is still mounted
      if (!isMountedRef.current) return;

      const apiError = err as APIError;
      setError(apiError);

      // Implement exponential backoff for network errors (1s, 2s, 4s)
      if (apiError.type === 'network' && isRetry && retryCount < 2) {
        const backoffDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        
        retryTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setRetryCount(prev => prev + 1);
            fetchData(true);
          }
        }, backoffDelay);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Fetch data on mount
  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [username]);

  // Manual retry handler
  const handleRetry = () => {
    setRetryCount(0);
    fetchData(false);
  };

  // Loading state
  if (loading && !data) {
    return (
      <section className={`bg-black text-white px-6 py-20 max-w-7xl mx-auto border-t border-slate-700/70 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <div className="arcade-title text-slate-400 text-[0.6rem] md:text-[0.8rem] mb-6 text-center">
            [ GITHUB ACTIVITY ]
          </div>
          <div className="flex flex-col items-center gap-6">
            <StreakCard
              currentStreak={0}
              longestStreak={0}
              totalContributions={0}
              isLoading={true}
            />
            <RecentCommitsCard commits={[]} isLoading={true} />
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <section className={`bg-black text-white px-6 py-20 max-w-7xl mx-auto border-t border-slate-700/70 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <div className="arcade-title text-slate-400 text-[0.6rem] md:text-[0.8rem] mb-6 text-center">
            [ GITHUB ACTIVITY ]
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full max-w-3xl rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.7)] overflow-hidden p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Error icon */}
                <div className="text-red-400 text-4xl">⚠</div>
                
                {/* Error message based on type */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-red-400">
                    {error.type === 'rate_limit' && 'Rate Limit Exceeded'}
                    {error.type === 'network' && 'Network Error'}
                    {error.type === 'not_found' && 'User Not Found'}
                    {error.type === 'unknown' && 'Something Went Wrong'}
                  </h3>
                  <p className="text-slate-300 text-sm">{error.message}</p>
                  
                  {/* Display retry time for rate limit errors */}
                  {error.type === 'rate_limit' && error.retryAfter !== undefined && (
                    <p className="text-slate-400 text-xs">
                      Please try again in {Math.ceil(error.retryAfter / 60)} minutes
                    </p>
                  )}
                </div>

                {/* Retry button */}
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200 text-white text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Success state with data
  if (data) {
    return (
      <section className={`bg-black text-white px-6 py-20 max-w-7xl mx-auto border-t border-slate-700/70 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <div className="arcade-title text-slate-400 text-[0.6rem] md:text-[0.8rem] mb-6 text-center">
            [ GITHUB ACTIVITY ]
          </div>
          
          {/* Display rate limit information when available */}
          {data.rateLimit && data.rateLimit.remaining < 10 && (
            <div className="mb-4 text-center">
              <p className="text-xs text-yellow-400">
                API Rate Limit: {data.rateLimit.remaining}/{data.rateLimit.limit} requests remaining
              </p>
            </div>
          )}

          <div className="flex flex-col items-center gap-6">
            <StreakCard
              currentStreak={data.streak.currentStreak}
              longestStreak={data.streak.longestStreak}
              totalContributions={data.streak.totalContributions}
            />
            <RecentCommitsCard commits={data.commits} />
          </div>
        </div>
      </section>
    );
  }

  // Fallback (should never reach here)
  return null;
}
