/**
 * Commit extraction utilities for GitHub Activity Display
 * 
 * This module provides functions to extract and process commit information
 * from GitHub events, specifically filtering PushEvents and creating
 * structured CommitInfo objects.
 */

import { GitHubEvent, CommitInfo } from './types';

/**
 * Extracts recent commits from GitHub events
 * 
 * Filters events to include only PushEvent types, extracts all commits
 * from each event's payload, and returns a limited array of CommitInfo objects.
 * 
 * @param events - Array of GitHub events to process
 * @param limit - Maximum number of commits to return
 * @returns Array of CommitInfo objects, limited to the specified count
 * 
 * @example
 * ```typescript
 * const events = await fetchGitHubEvents('username');
 * const recentCommits = extractRecentCommits(events, 5);
 * // Returns up to 5 most recent commits
 * ```
 * 
 * **Validates Requirements:**
 * - 2.1: Display up to 5 recent commits
 * - 2.2: Show commit message
 * - 2.3: Show repository name
 * - 2.4: Show relative timestamp
 * - 2.5: Provide clickable link to commit
 * - 9.2: Limit result to maximum of 5 commits
 * - 15.1: Filter events to include only PushEvent types
 * - 15.2: Extract all commits from each PushEvent payload
 * - 15.3: Create CommitInfo objects with required fields
 * - 15.4: Format commit URLs correctly
 * - 15.5: Limit results to specified count
 */
export function extractRecentCommits(events: GitHubEvent[], limit: number): CommitInfo[] {
  const commits: CommitInfo[] = [];
  
  // Filter to only PushEvent types (Requirement 15.1)
  const pushEvents = events.filter(event => event.type === 'PushEvent');
  
  // Extract all commits from each PushEvent (Requirement 15.2)
  for (const event of pushEvents) {
    // Check if the event has commits in its payload
    if (event.payload.commits && Array.isArray(event.payload.commits)) {
      // Process each commit in the event
      for (const commit of event.payload.commits) {
        // Create CommitInfo object with all required fields (Requirement 15.3)
        const commitInfo: CommitInfo = {
          sha: commit.sha,
          message: commit.message,
          repo: event.repo.name,
          timestamp: event.created_at,
          // Format commit URL as https://github.com/{repo}/commit/{sha} (Requirement 15.4)
          url: `https://github.com/${event.repo.name}/commit/${commit.sha}`
        };
        
        commits.push(commitInfo);
        
        // Stop if we've reached the limit (Requirement 15.5)
        if (commits.length >= limit) {
          return commits;
        }
      }
    }
  }
  
  // Return commits limited to specified count (Requirement 15.5)
  return commits;
}
