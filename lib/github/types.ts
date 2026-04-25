/**
 * Type definitions for GitHub Activity Display feature
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the GitHub activity integration, including API responses, processed data,
 * cache management, and error handling.
 */

// ============================================================================
// API Response Types
// ============================================================================

/**
 * GitHub user profile data from /users/{username} endpoint
 */
export interface GitHubUser {
  login: string;
  public_repos: number;
  followers: number;
  created_at: string;
}

/**
 * GitHub event data from /users/{username}/events endpoint
 */
export interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  payload: {
    commits?: Array<{
      sha: string;
      message: string;
    }>;
  };
  created_at: string;
}

// ============================================================================
// Processed Data Types
// ============================================================================

/**
 * Contribution streak metrics calculated from GitHub events
 */
export interface StreakData {
  /** Number of consecutive days with contributions (0 if no recent activity) */
  currentStreak: number;
  /** Maximum consecutive days with contributions across all time */
  longestStreak: number;
  /** Total count of contribution events */
  totalContributions: number;
}

/**
 * Individual commit information extracted from GitHub events
 */
export interface CommitInfo {
  /** Commit SHA hash */
  sha: string;
  /** Commit message */
  message: string;
  /** Repository name (format: owner/repo) */
  repo: string;
  /** ISO 8601 timestamp of the commit */
  timestamp: string;
  /** Full GitHub URL to the commit */
  url: string;
}

/**
 * GitHub API rate limit information
 */
export interface RateLimitInfo {
  /** Number of requests remaining in current window */
  remaining: number;
  /** Total request limit per window */
  limit: number;
  /** ISO 8601 timestamp when rate limit resets */
  resetAt: string;
}

/**
 * Complete GitHub activity data including streak, commits, and rate limit info
 */
export interface GitHubActivityData {
  /** Contribution streak metrics */
  streak: StreakData;
  /** Recent commits (max 5) */
  commits: CommitInfo[];
  /** Current rate limit status */
  rateLimit: RateLimitInfo;
  /** Unix timestamp when data was cached (optional) */
  cachedAt?: number;
}

// ============================================================================
// Cache Management Types
// ============================================================================

/**
 * Generic cache entry structure for localStorage
 * @template T The type of data being cached
 */
export interface CacheEntry<T> {
  /** The cached data */
  data: T;
  /** Unix timestamp when data was cached */
  timestamp: number;
  /** Cache expiration duration in milliseconds */
  expiresIn: number;
}

// ============================================================================
// Error Handling Types
// ============================================================================

/**
 * Typed error object for API failures
 */
export interface APIError {
  /** Error type classification */
  type: 'rate_limit' | 'network' | 'not_found' | 'unknown';
  /** Human-readable error message */
  message: string;
  /** Seconds until retry is allowed (only for rate_limit type) */
  retryAfter?: number;
}
