/**
 * Streak calculation utilities for GitHub Activity Display
 * 
 * This module implements the core streak calculation algorithm that processes
 * GitHub events to determine contribution streaks and metrics.
 * 
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 12.1, 12.2**
 */

import { GitHubEvent, StreakData } from './types';

/**
 * Helper function to normalize a date to midnight (day boundary)
 * 
 * @param date - The date to normalize
 * @returns A new Date object set to midnight of the same day
 */
function normalizeToDayBoundary(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Helper function to check if a date is today
 * 
 * @param date - The date to check (should be normalized to midnight)
 * @returns True if the date is today
 */
function isToday(date: Date): boolean {
  const today = normalizeToDayBoundary(new Date());
  return date.getTime() === today.getTime();
}

/**
 * Helper function to check if a date is yesterday
 * 
 * @param date - The date to check (should be normalized to midnight)
 * @returns True if the date is yesterday
 */
function isYesterday(date: Date): boolean {
  const yesterday = normalizeToDayBoundary(new Date());
  yesterday.setDate(yesterday.getDate() - 1);
  return date.getTime() === yesterday.getTime();
}

/**
 * Calculate contribution streak metrics from GitHub events
 * 
 * This function implements the streak calculation algorithm as specified in the
 * design document. It processes GitHub events to determine:
 * - Current streak (consecutive days with contributions, must include today or yesterday)
 * - Longest streak (maximum consecutive days across all time)
 * - Total contributions (count of contribution events)
 * 
 * **Algorithm:**
 * 1. Filter events to include only PushEvent, PullRequestEvent, IssuesEvent
 * 2. Normalize all timestamps to day boundaries (midnight)
 * 3. Iterate through events in chronological order (newest first)
 * 4. Track consecutive days and update streak counters
 * 5. Reset current streak if gap > 1 day or if most recent contribution is not recent
 * 
 * **Preconditions:**
 * - events is a valid array (may be empty)
 * - Each event has valid created_at timestamp
 * - Events are sorted by date (newest first)
 * 
 * **Postconditions:**
 * - Returns StreakData with all fields >= 0
 * - longestStreak >= currentStreak always true
 * - totalContributions equals count of contribution events
 * - Current streak is 0 if no activity today or yesterday
 * 
 * **Loop Invariants:**
 * - tempStreak >= 0 throughout iteration
 * - longestStreak >= tempStreak at loop end
 * - lastDate is always normalized to midnight
 * - Processed events maintain chronological order
 * 
 * @param events - Array of GitHub events (sorted newest first)
 * @returns StreakData object with current streak, longest streak, and total contributions
 * 
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 12.1, 12.2**
 */
export function calculateStreak(events: GitHubEvent[]): StreakData {
  // PRECONDITION: events is valid array, sorted newest first
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;
  let isCurrentStreakActive = false; // Track if we're still building the current streak
  
  // Filter contribution events (Requirement 5.1)
  const contributionEvents = events.filter(e => 
    e.type === 'PushEvent' || 
    e.type === 'PullRequestEvent' || 
    e.type === 'IssuesEvent'
  );
  
  const totalContributions = contributionEvents.length;
  
  // Handle empty events case
  if (contributionEvents.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalContributions: 0
    };
  }
  
  // LOOP INVARIANT: tempStreak >= 0, longestStreak >= tempStreak
  for (const event of contributionEvents) {
    // Normalize timestamp to day boundary (Requirement 5.2)
    const eventDate = normalizeToDayBoundary(new Date(event.created_at));
    
    if (lastDate === null) {
      // First event - initialize streaks
      tempStreak = 1;
      // Current streak only counts if event is today or yesterday (Requirement 5.6)
      if (isToday(eventDate) || isYesterday(eventDate)) {
        currentStreak = 1;
        isCurrentStreakActive = true;
      } else {
        currentStreak = 0;
        isCurrentStreakActive = false;
      }
    } else {
      // Calculate day difference between consecutive events
      const dayDiff = Math.floor((lastDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        // Consecutive day - increment streak (Requirement 5.3)
        tempStreak++;
        if (isCurrentStreakActive) {
          currentStreak++;
        }
      } else if (dayDiff > 1) {
        // Gap in contributions - update longest and reset temp streak (Requirement 5.4)
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        isCurrentStreakActive = false; // Gap breaks the current streak
      } else if (dayDiff === 0) {
        // Same day - don't increment streak, but count as contribution
        // tempStreak stays the same
      }
    }
    
    lastDate = eventDate;
    // ASSERT: tempStreak > 0 && longestStreak >= 0
  }
  
  // Update longest streak with final temp streak (Requirement 5.5)
  longestStreak = Math.max(longestStreak, tempStreak);
  
  // POSTCONDITION: longestStreak >= currentStreak >= 0 (Requirements 12.1, 12.2)
  return {
    currentStreak,
    longestStreak,
    totalContributions
  };
}
