# Implementation Plan: GitHub Activity Display

## Overview

This implementation plan breaks down the GitHub Activity Display feature into discrete coding tasks. The feature will integrate GitHub API to display user contribution streaks and recent commits in the portfolio application. The implementation follows a bottom-up approach: building core utilities first, then the API service layer, followed by React components, and finally integration into the portfolio page.

## Tasks

- [x] 1. Set up project structure and type definitions
  - Create `lib/github/` directory for GitHub-related utilities
  - Create `lib/cache.ts` for cache management utilities
  - Define all TypeScript interfaces and types in `lib/github/types.ts`
  - Include: `GitHubActivityData`, `StreakData`, `CommitInfo`, `RateLimitInfo`, `CacheEntry`, `APIError`, `GitHubUser`, `GitHubEvent`
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ]* 1.1 Write property test for type definitions
  - **Property 2: Streak Consistency Invariant**
  - **Validates: Requirements 1.5, 5.5, 12.1, 12.2**
  - Test that for any StreakData object, longestStreak >= currentStreak >= 0

- [ ] 2. Implement cache management utilities
  - [x] 2.1 Create cache utility functions in `lib/cache.ts`
    - Implement `getCachedData<T>(key: string): T | null`
    - Implement `setCachedData<T>(key: string, data: T, expiresIn: number): void`
    - Implement `clearExpiredCache(key: string): void`
    - Add error handling for localStorage quota exceeded
    - Add error handling for invalid JSON parsing
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 8.1, 8.2, 8.3, 8.4, 8.5, 12.4, 12.5, 12.6_

  - [ ]* 2.2 Write property test for cache validity
    - **Property 1: Cache Validity**
    - **Validates: Requirements 3.3, 3.4, 12.6**
    - Test that cache returns data when not expired and null when expired

  - [ ]* 2.3 Write property test for cache entry structure
    - **Property 8: Cache Entry Structure Validity**
    - **Validates: Requirements 3.1, 3.5, 12.4, 12.5**
    - Test that cache entries contain valid timestamp, positive expiresIn, and serialized data

  - [ ]* 2.4 Write unit tests for cache utilities
    - Test cache set/get round-trip preserves data
    - Test expired cache returns null
    - Test invalid JSON returns null
    - Test localStorage quota exceeded handling
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 8.1, 8.2, 8.4_

- [ ] 3. Implement streak calculation algorithm
  - [x] 3.1 Create streak calculation function in `lib/github/streak.ts`
    - Implement `calculateStreak(events: GitHubEvent[]): StreakData`
    - Filter events to include only PushEvent, PullRequestEvent, IssuesEvent
    - Normalize timestamps to day boundaries (midnight)
    - Calculate current streak (must be today or yesterday)
    - Calculate longest streak across all events
    - Count total contributions
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 12.1, 12.2_

  - [ ]* 3.2 Write property test for streak consistency
    - **Property 2: Streak Consistency Invariant**
    - **Validates: Requirements 1.5, 5.5, 12.1, 12.2**
    - Test that longestStreak >= currentStreak >= 0 for any event sequence

  - [ ]* 3.3 Write property test for contribution event filtering
    - **Property 4: Contribution Event Filtering**
    - **Validates: Requirements 5.1, 5.7, 15.1**
    - Test that only PushEvent, PullRequestEvent, IssuesEvent are counted

  - [ ]* 3.4 Write property test for consecutive day streak increment
    - **Property 5: Consecutive Day Streak Increment**
    - **Validates: Requirement 5.3**
    - Test that consecutive days increment streak by one

  - [ ]* 3.5 Write property test for streak reset on gap
    - **Property 6: Streak Reset on Gap**
    - **Validates: Requirement 5.4**
    - Test that gaps > 1 day reset current streak to zero

  - [ ]* 3.6 Write property test for timestamp normalization
    - **Property 7: Timestamp Normalization**
    - **Validates: Requirement 5.2**
    - Test that all timestamps are normalized to midnight

  - [ ]* 3.7 Write unit tests for streak calculation
    - Test empty events array returns zero streak
    - Test single event returns correct streak based on date
    - Test consecutive days increment streak correctly
    - Test gap in days resets current streak
    - Test longest streak tracks maximum correctly
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 4. Implement commit extraction logic
  - [x] 4.1 Create commit extraction function in `lib/github/commits.ts`
    - Implement `extractRecentCommits(events: GitHubEvent[], limit: number): CommitInfo[]`
    - Filter events to include only PushEvent types
    - Extract all commits from each PushEvent payload
    - Create CommitInfo objects with sha, message, repo, timestamp, url
    - Format commit URLs as `https://github.com/{repo}/commit/{sha}`
    - Limit results to specified count
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.2, 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ]* 4.2 Write property test for commit array length limit
    - **Property 3: Commit Array Length Limit**
    - **Validates: Requirements 2.1, 9.2, 12.3, 15.5**
    - Test that result length <= limit for any events array

  - [ ]* 4.3 Write property test for commit extraction completeness
    - **Property 9: Commit Extraction Completeness**
    - **Validates: Requirements 15.2, 15.3, 15.4**
    - Test that all commits from PushEvents are extracted with required fields

  - [ ]* 4.4 Write unit tests for commit extraction
    - Test filters only PushEvents
    - Test limits to requested count
    - Test formats commit URLs correctly
    - Test handles events without commits
    - Test extracts all commits from multi-commit PushEvents
    - _Requirements: 2.1, 9.2, 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement GitHub API service layer
  - [x] 6.1 Create API service in `lib/github/api.ts`
    - Implement `fetchUserActivity(username: string): Promise<GitHubActivityData>`
    - Check cache before making API calls
    - Make parallel requests using Promise.all for user data, events, and rate limit
    - Handle 403 rate limit responses
    - Handle 404 user not found responses
    - Handle network errors with appropriate error types
    - Validate API responses with TypeScript type guards
    - Calculate streak using streak utility
    - Extract commits using commit utility
    - Cache successful responses for 15 minutes
    - _Requirements: 1.1, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 9.1, 9.3, 9.4, 9.5_

  - [ ]* 6.2 Write property test for response validation
    - **Property 13: Response Validation**
    - **Validates: Requirements 7.1, 7.2, 14.4**
    - Test that invalid responses throw APIError with type "unknown"

  - [ ]* 6.3 Write property test for data caching with timestamp
    - **Property 17: Data Caching with Timestamp**
    - **Validates: Requirement 3.1**
    - Test that successful fetches store data with current timestamp

  - [ ]* 6.4 Write unit tests for API service
    - Test successful data fetch and caching
    - Test cache hit returns cached data without API call
    - Test rate limit handling (403 response)
    - Test user not found handling (404 response)
    - Test network error handling
    - Test invalid response handling
    - Test parallel request execution
    - _Requirements: 1.1, 3.2, 3.3, 4.1, 4.2, 4.3, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 9.1_

- [ ] 7. Implement StreakCard component
  - [x] 7.1 Create StreakCard component in `components/home/StreakCard.tsx`
    - Accept props: currentStreak, longestStreak, totalContributions, isLoading
    - Display all three metrics with labels
    - Implement loading skeleton state
    - Add number animation on mount using Framer Motion
    - Use dark/terminal color scheme (black background, white text)
    - Match existing portfolio section styling
    - _Requirements: 1.2, 1.3, 1.4, 10.1, 10.2, 11.1, 11.2, 11.3, 11.4_

  - [ ]* 7.2 Write property test for display field completeness
    - **Property 10: Display Field Completeness**
    - **Validates: Requirements 1.2, 1.3, 1.4**
    - Test that all three metrics are rendered in component output

  - [ ]* 7.3 Write unit tests for StreakCard
    - Test renders all metrics correctly
    - Test displays loading state
    - Test number animation triggers on mount
    - Test styling matches design system
    - _Requirements: 1.2, 1.3, 1.4, 10.1, 10.2, 11.1, 11.2, 11.3_

- [ ] 8. Implement RecentCommitsCard component
  - [x] 8.1 Create RecentCommitsCard component in `components/home/RecentCommitsCard.tsx`
    - Accept props: commits (CommitInfo[]), isLoading
    - Display up to 5 commits with message, repo, timestamp
    - Truncate commit messages longer than 60 characters with ellipsis
    - Format timestamps as relative time (e.g., "2 hours ago")
    - Provide clickable links to commits on GitHub
    - Implement loading skeleton state
    - Use dark/terminal color scheme
    - Match existing portfolio section styling
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 10.1, 10.2, 11.1, 11.2, 11.4, 11.5_

  - [ ]* 8.2 Write property test for commit display completeness
    - **Property 11: Commit Display Completeness**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5**
    - Test that all required fields are displayed for each commit

  - [ ]* 8.3 Write property test for commit message truncation
    - **Property 16: Commit Message Truncation**
    - **Validates: Requirement 11.5**
    - Test that messages > 60 chars are truncated with ellipsis

  - [ ]* 8.4 Write unit tests for RecentCommitsCard
    - Test renders all commit fields correctly
    - Test truncates long commit messages
    - Test formats relative timestamps
    - Test commit links are correct
    - Test displays loading state
    - Test limits display to 5 commits
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 10.1, 10.2, 11.5_

- [ ] 9. Implement GitHubActivitySection main component
  - [x] 9.1 Create GitHubActivitySection component in `components/home/GitHubActivitySection.tsx`
    - Mark as 'use client' for Next.js App Router
    - Accept props: username (required), className (optional)
    - Implement useEffect to fetch data on mount
    - Manage loading, error, and success states
    - Display loading indicator during fetch
    - Display error state with appropriate messages for each error type
    - Display rate limit information when available
    - Display StreakCard and RecentCommitsCard on success
    - Implement retry button for errors
    - Implement exponential backoff for network errors (1s, 2s, 4s)
    - Handle component unmounting cleanup
    - _Requirements: 1.1, 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4, 6.5, 10.1, 10.2, 10.3, 10.4, 10.5, 13.1, 13.2, 13.3, 13.4, 13.5_

  - [ ]* 9.2 Write property test for error state display
    - **Property 12: Error State Display**
    - **Validates: Requirements 10.3, 10.4, 10.5**
    - Test that error states include type context and retryAfter when present

  - [ ]* 9.3 Write property test for rate limit information display
    - **Property 15: Rate Limit Information Display**
    - **Validates: Requirement 4.4**
    - Test that rate limit info (remaining, reset time) is displayed

  - [ ]* 9.4 Write property test for localStorage error containment
    - **Property 14: localStorage Error Containment**
    - **Validates: Requirement 8.4**
    - Test that localStorage errors don't propagate to UI

  - [ ]* 9.5 Write unit tests for GitHubActivitySection
    - Test fetches data on mount
    - Test displays loading state during fetch
    - Test displays success state with data
    - Test displays error state for each error type
    - Test retry button functionality
    - Test exponential backoff for network errors
    - Test rate limit handling with cached data
    - Test component cleanup on unmount
    - _Requirements: 1.1, 4.1, 4.2, 4.3, 6.1, 6.2, 6.3, 10.1, 10.2, 10.3, 13.4, 13.5_

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Integrate GitHubActivitySection into portfolio page
  - [ ] 11.1 Add GitHubActivitySection to `app/page.tsx`
    - Import GitHubActivitySection component
    - Position between SkillsSection and LiveSection
    - Pass username prop (use appropriate GitHub username)
    - Ensure component fits visual flow of page
    - _Requirements: 11.1, 11.2, 13.1, 13.3_

  - [ ]* 11.2 Write integration test for page layout
    - Test GitHubActivitySection renders in correct position
    - Test component integrates without breaking existing sections
    - Test page loads successfully with new section
    - _Requirements: 11.1, 11.2, 13.3_

- [ ] 12. Implement security best practices
  - [ ] 12.1 Review and validate security implementation
    - Verify no dangerouslySetInnerHTML usage for commit messages
    - Verify no authentication tokens stored in localStorage
    - Verify API requests use unauthenticated endpoints or backend proxy
    - Verify all API responses validated with TypeScript type guards
    - Verify React automatic escaping for user-generated content
    - Add security comments to code where applicable
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [ ]* 12.2 Write security validation tests
    - Test commit messages are safely rendered (no XSS)
    - Test no sensitive data in localStorage
    - Test API response validation catches malformed data
    - _Requirements: 14.1, 14.2, 14.4, 14.5_

- [ ] 13. Final checkpoint - Ensure all tests pass and feature is complete
  - Run all tests (unit, property, integration)
  - Verify visual consistency with existing portfolio sections
  - Test loading states, error states, and success states manually
  - Verify caching behavior in browser DevTools
  - Test rate limit handling by exhausting API quota
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript as specified in the design document
- No additional npm dependencies are required beyond existing project dependencies
- The feature uses native fetch API and browser localStorage
- All components follow Next.js 16 App Router conventions ('use client' directive)
- Security best practices are enforced throughout (no XSS, no token storage, response validation)
