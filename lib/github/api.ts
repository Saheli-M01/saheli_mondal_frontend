/**
 * GitHub API Service for fetching user activity data
 * 
 * This module provides the main API service layer that orchestrates data fetching
 * from GitHub, caching, and error handling. It implements parallel requests,
 * rate limit handling, and response validation.
 * 
 * **Validates: Requirements 1.1, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5,
 *              6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 9.1, 9.3, 9.4, 9.5**
 */

import { getCachedData, setCachedData } from '../cache';
import { calculateStreak } from './streak';
import { extractRecentCommits } from './commits';
import {
  GitHubActivityData,
  GitHubUser,
  GitHubEvent,
  APIError,
  RateLimitInfo
} from './types';

/**
 * Cache key prefix for GitHub activity data
 */
const CACHE_KEY_PREFIX = 'github_activity_';

/**
 * Cache expiration duration: 15 minutes in milliseconds
 */
const CACHE_EXPIRATION = 15 * 60 * 1000;

/**
 * GitHub API base URL
 */
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Type guard to validate GitHubUser response structure
 * 
 * @param data - Unknown data to validate
 * @returns True if data matches GitHubUser interface
 */
function isGitHubUser(data: unknown): data is GitHubUser {
  if (typeof data !== 'object' || data === null) return false;
  
  const user = data as Record<string, unknown>;
  
  return (
    typeof user.login === 'string' &&
    typeof user.public_repos === 'number' &&
    typeof user.followers === 'number' &&
    typeof user.created_at === 'string'
  );
}

/**
 * Type guard to validate GitHubEvent array response structure
 * 
 * @param data - Unknown data to validate
 * @returns True if data is an array of GitHubEvent objects
 */
function isGitHubEventArray(data: unknown): data is GitHubEvent[] {
  if (!Array.isArray(data)) return false;
  
  // Check first few events for structure validation
  const samplesToCheck = Math.min(data.length, 3);
  
  for (let i = 0; i < samplesToCheck; i++) {
    const event = data[i];
    
    if (typeof event !== 'object' || event === null) return false;
    
    const e = event as Record<string, unknown>;
    
    if (
      typeof e.id !== 'string' ||
      typeof e.type !== 'string' ||
      typeof e.created_at !== 'string' ||
      typeof e.repo !== 'object' ||
      e.repo === null
    ) {
      return false;
    }
    
    const repo = e.repo as Record<string, unknown>;
    if (typeof repo.name !== 'string' || typeof repo.url !== 'string') {
      return false;
    }
  }
  
  return true;
}

/**
 * Type guard to validate rate limit response structure
 * 
 * @param data - Unknown data to validate
 * @returns True if data contains valid rate limit information
 */
function isRateLimitResponse(data: unknown): data is { rate: { remaining: number; limit: number; reset: number } } {
  if (typeof data !== 'object' || data === null) return false;
  
  const response = data as Record<string, unknown>;
  
  if (typeof response.rate !== 'object' || response.rate === null) return false;
  
  const rate = response.rate as Record<string, unknown>;
  
  return (
    typeof rate.remaining === 'number' &&
    typeof rate.limit === 'number' &&
    typeof rate.reset === 'number'
  );
}

/**
 * Fetches user activity data from GitHub API
 * 
 * This function implements the main data fetching algorithm as specified in the
 * design document. It:
 * 1. Checks cache before making API calls
 * 2. Makes parallel requests for user data, events, and rate limit
 * 3. Handles 403 rate limit responses
 * 4. Handles 404 user not found responses
 * 5. Handles network errors with appropriate error types
 * 6. Validates API responses with TypeScript type guards
 * 7. Calculates streak using streak utility
 * 8. Extracts commits using commit utility
 * 9. Caches successful responses for 15 minutes
 * 
 * **Preconditions:**
 * - username is non-empty string
 * - username contains only valid GitHub username characters
 * - Network connection is available
 * 
 * **Postconditions:**
 * - Returns valid GitHubActivityData object on success
 * - Throws APIError with appropriate type on failure
 * - Rate limit info is always populated in response
 * - Commits array contains max 5 items
 * - All timestamps are valid ISO 8601 strings
 * 
 * @param username - GitHub username to fetch activity for
 * @returns Promise resolving to GitHubActivityData
 * @throws APIError with type 'rate_limit', 'network', 'not_found', or 'unknown'
 * 
 * **Validates: Requirements 1.1, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5,
 *              6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 9.1, 9.3, 9.4, 9.5**
 */
export async function fetchUserActivity(username: string): Promise<GitHubActivityData> {
  // PRECONDITION: username is valid non-empty string
  
  // Step 1: Check cache first (Requirements 3.2, 3.3)
  const cacheKey = `${CACHE_KEY_PREFIX}${username}`;
  const cached = getCachedData<GitHubActivityData>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }
  
  // Step 2: Fetch user data, events, and rate limit in parallel (Requirement 9.1)
  try {
    const [userResponse, eventsResponse, rateLimitResponse] = await Promise.all([
      fetch(`${GITHUB_API_BASE}/users/${username}`),
      fetch(`${GITHUB_API_BASE}/users/${username}/events?per_page=100`),
      fetch(`${GITHUB_API_BASE}/rate_limit`)
    ]);
    
    // Step 3: Check for rate limiting (Requirements 4.1, 4.3)
    if (userResponse.status === 403 || eventsResponse.status === 403) {
      // Try to get rate limit data
      let retryAfter: number | undefined;
      
      if (rateLimitResponse.ok) {
        const rateLimitData = await rateLimitResponse.json();
        
        if (isRateLimitResponse(rateLimitData)) {
          const resetTime = rateLimitData.rate.reset * 1000; // Convert to milliseconds
          const now = Date.now();
          retryAfter = Math.max(0, Math.ceil((resetTime - now) / 1000)); // Seconds until reset
        }
      }
      
      const error: APIError = {
        type: 'rate_limit',
        message: 'GitHub API rate limit exceeded',
        retryAfter
      };
      
      throw error;
    }
    
    // Step 4: Handle 404 user not found (Requirement 6.5)
    if (userResponse.status === 404) {
      const error: APIError = {
        type: 'not_found',
        message: `GitHub user '${username}' not found`
      };
      
      throw error;
    }
    
    // Check for other HTTP errors
    if (!userResponse.ok || !eventsResponse.ok || !rateLimitResponse.ok) {
      const error: APIError = {
        type: 'network',
        message: 'Failed to fetch GitHub data'
      };
      
      throw error;
    }
    
    // Step 5: Parse responses
    const userData = await userResponse.json();
    const eventsData = await eventsResponse.json();
    const rateLimitData = await rateLimitResponse.json();
    
    // Step 6: Validate API responses with type guards (Requirements 7.1, 7.2)
    if (!isGitHubUser(userData)) {
      const error: APIError = {
        type: 'unknown',
        message: 'Invalid user data structure from GitHub API'
      };
      
      throw error;
    }
    
    if (!isGitHubEventArray(eventsData)) {
      const error: APIError = {
        type: 'unknown',
        message: 'Invalid events data structure from GitHub API'
      };
      
      throw error;
    }
    
    if (!isRateLimitResponse(rateLimitData)) {
      const error: APIError = {
        type: 'unknown',
        message: 'Invalid rate limit data structure from GitHub API'
      };
      
      throw error;
    }
    
    // Step 7: Process data - calculate streak and extract commits
    const streak = calculateStreak(eventsData);
    const commits = extractRecentCommits(eventsData, 5); // Requirement 9.2
    
    // Step 8: Build result with rate limit info (Requirement 4.4)
    const rateLimit: RateLimitInfo = {
      remaining: rateLimitData.rate.remaining,
      limit: rateLimitData.rate.limit,
      resetAt: new Date(rateLimitData.rate.reset * 1000).toISOString()
    };
    
    const result: GitHubActivityData = {
      streak,
      commits,
      rateLimit,
      cachedAt: Date.now()
    };
    
    // Step 9: Cache result for 15 minutes (Requirements 3.1, 3.4)
    setCachedData(cacheKey, result, CACHE_EXPIRATION);
    
    return result;
    
  } catch (error) {
    // Re-throw APIError instances
    if (isAPIError(error)) {
      throw error;
    }
    
    // Handle network errors (Requirement 6.1)
    const networkError: APIError = {
      type: 'network',
      message: error instanceof Error ? error.message : 'Failed to fetch GitHub data'
    };
    
    throw networkError;
  }
  
  // POSTCONDITION: Returns valid GitHubActivityData or throws APIError
}

/**
 * Type guard to check if an error is an APIError
 * 
 * @param error - Unknown error to check
 * @returns True if error is an APIError
 */
function isAPIError(error: unknown): error is APIError {
  if (typeof error !== 'object' || error === null) return false;
  
  const apiError = error as Record<string, unknown>;
  
  return (
    typeof apiError.type === 'string' &&
    ['rate_limit', 'network', 'not_found', 'unknown'].includes(apiError.type) &&
    typeof apiError.message === 'string'
  );
}
