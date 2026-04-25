# Requirements Document: GitHub Activity Display

## Introduction

This document specifies the requirements for integrating GitHub activity metrics into the portfolio application. The system will display user contribution streaks and recent commits by fetching data from the GitHub REST API, implementing client-side caching to manage rate limits, and providing graceful error handling for various failure scenarios.

## Glossary

- **GitHub_API_Service**: The service layer responsible for making HTTP requests to GitHub's REST API endpoints
- **Cache_Manager**: The component responsible for storing and retrieving data from browser localStorage
- **Activity_Section**: The main React component that orchestrates data fetching and display
- **Streak_Card**: The UI component displaying contribution streak metrics
- **Commits_Card**: The UI component displaying recent commit information
- **Rate_Limiter**: The component that monitors and handles GitHub API rate limit responses
- **Contribution_Event**: A GitHub event of type PushEvent, PullRequestEvent, or IssuesEvent
- **Cache_Entry**: A data structure containing cached data, timestamp, and expiration time
- **API_Error**: A typed error object representing different failure scenarios

## Requirements

### Requirement 1: Display Contribution Streak

**User Story:** As a portfolio visitor, I want to see the developer's GitHub contribution streak, so that I can understand their coding consistency and commitment.

#### Acceptance Criteria

1. WHEN the Activity_Section component mounts, THE GitHub_API_Service SHALL fetch user activity data from GitHub REST API
2. WHEN contribution data is successfully retrieved, THE Streak_Card SHALL display the current streak in days
3. WHEN contribution data is successfully retrieved, THE Streak_Card SHALL display the longest streak in days
4. WHEN contribution data is successfully retrieved, THE Streak_Card SHALL display the total contributions count
5. THE Streak_Card SHALL ensure that the displayed longest streak is greater than or equal to the current streak

### Requirement 2: Display Recent Commits

**User Story:** As a portfolio visitor, I want to see the developer's recent commits, so that I can understand what they've been working on recently.

#### Acceptance Criteria

1. WHEN commit data is successfully retrieved, THE Commits_Card SHALL display up to 5 recent commits
2. WHEN displaying a commit, THE Commits_Card SHALL show the commit message
3. WHEN displaying a commit, THE Commits_Card SHALL show the repository name
4. WHEN displaying a commit, THE Commits_Card SHALL show the relative timestamp
5. WHEN a commit is displayed, THE Commits_Card SHALL provide a clickable link to the commit on GitHub

### Requirement 3: Implement Client-Side Caching

**User Story:** As a system operator, I want API responses to be cached client-side, so that we minimize API calls and avoid rate limit exhaustion.

#### Acceptance Criteria

1. WHEN GitHub activity data is successfully fetched, THE Cache_Manager SHALL store the data in browser localStorage with a timestamp
2. WHEN the Activity_Section requests data, THE Cache_Manager SHALL check for cached data before making API calls
3. WHEN cached data exists and is less than 15 minutes old, THE Cache_Manager SHALL return the cached data without making an API call
4. WHEN cached data is older than 15 minutes, THE Cache_Manager SHALL fetch fresh data from the GitHub API
5. WHEN storing cache data, THE Cache_Manager SHALL include the cache timestamp and expiration duration in the cache entry

### Requirement 4: Handle API Rate Limits

**User Story:** As a portfolio visitor, I want to see meaningful content even when rate limits are reached, so that I have a good experience regardless of API availability.

#### Acceptance Criteria

1. WHEN the GitHub API returns a 403 status code indicating rate limit exceeded, THE Rate_Limiter SHALL check for cached data
2. IF rate limit is exceeded and cached data exists, THEN THE Activity_Section SHALL display the cached data with a rate limit indicator
3. IF rate limit is exceeded and no cached data exists, THEN THE Activity_Section SHALL display an error message with the rate limit reset time
4. WHEN rate limit information is available, THE Activity_Section SHALL display the remaining request count and reset time
5. WHEN the rate limit reset time is reached, THE Activity_Section SHALL allow retry attempts

### Requirement 5: Calculate Contribution Streak

**User Story:** As a developer, I want the streak calculation to be accurate, so that visitors see correct contribution metrics.

#### Acceptance Criteria

1. WHEN calculating streak from events, THE GitHub_API_Service SHALL filter events to include only PushEvent, PullRequestEvent, and IssuesEvent types
2. WHEN processing contribution events, THE GitHub_API_Service SHALL normalize all timestamps to day boundaries (midnight)
3. WHEN two contribution events occur on consecutive days, THE GitHub_API_Service SHALL increment the streak counter
4. WHEN a gap of more than one day exists between contributions, THE GitHub_API_Service SHALL reset the current streak to zero
5. WHEN calculating the longest streak, THE GitHub_API_Service SHALL track the maximum consecutive day count across all events
6. WHEN the most recent contribution is not from today or yesterday, THE GitHub_API_Service SHALL set the current streak to zero
7. THE GitHub_API_Service SHALL ensure that total contributions equals the count of filtered contribution events

### Requirement 6: Handle Network Errors

**User Story:** As a portfolio visitor, I want to see helpful error messages when data cannot be loaded, so that I understand what went wrong.

#### Acceptance Criteria

1. WHEN a network request fails due to timeout or connection error, THE Activity_Section SHALL display a network error message
2. IF network error occurs and cached data exists, THEN THE Activity_Section SHALL display the cached data with a "stale data" indicator
3. WHEN a network error occurs, THE Activity_Section SHALL provide a manual retry button
4. WHEN retry is attempted after network error, THE Activity_Section SHALL implement exponential backoff with delays of 1s, 2s, and 4s
5. WHEN the GitHub API returns a 404 status for a username, THE Activity_Section SHALL display a "User not found" message

### Requirement 7: Validate API Responses

**User Story:** As a developer, I want API responses to be validated, so that unexpected data structures don't crash the application.

#### Acceptance Criteria

1. WHEN the GitHub API returns a response, THE GitHub_API_Service SHALL validate that the response contains expected data structures
2. WHEN the API response is missing required fields, THE GitHub_API_Service SHALL throw an API_Error with type "unknown"
3. WHEN API response validation fails, THE Activity_Section SHALL log detailed error information to the console
4. IF response validation fails and cached data exists, THEN THE Activity_Section SHALL display the cached data
5. WHEN response validation fails, THE Activity_Section SHALL retry once after 5 seconds

### Requirement 8: Manage localStorage Quota

**User Story:** As a system operator, I want the application to handle localStorage quota limits gracefully, so that the application continues functioning even when storage is full.

#### Acceptance Criteria

1. WHEN attempting to store cache data and localStorage quota is exceeded, THE Cache_Manager SHALL log a warning to the console
2. IF localStorage quota is exceeded, THEN THE Cache_Manager SHALL continue operation without caching
3. WHEN localStorage quota is exceeded, THE Activity_Section SHALL fetch data on every component mount
4. WHEN localStorage operations fail, THE Cache_Manager SHALL not throw errors that propagate to the UI
5. THE Cache_Manager SHALL attempt to clear old cache entries when quota is exceeded

### Requirement 9: Optimize API Performance

**User Story:** As a portfolio visitor, I want the GitHub activity data to load quickly, so that I have a smooth browsing experience.

#### Acceptance Criteria

1. WHEN fetching GitHub data, THE GitHub_API_Service SHALL make parallel requests for user data, events, and rate limit information using Promise.all
2. WHEN extracting recent commits, THE GitHub_API_Service SHALL limit the result to a maximum of 5 commits
3. WHEN the Activity_Section component is mounted, THE Activity_Section SHALL fetch data only once per mount lifecycle
4. THE GitHub_API_Service SHALL complete all parallel API requests within 500 milliseconds under normal network conditions
5. WHEN processing events for streak calculation, THE GitHub_API_Service SHALL perform the calculation in a single pass through the events array

### Requirement 10: Display Loading and Error States

**User Story:** As a portfolio visitor, I want to see appropriate feedback during data loading and errors, so that I understand the current state of the application.

#### Acceptance Criteria

1. WHEN the Activity_Section begins fetching data, THE Activity_Section SHALL display a loading indicator
2. WHEN data fetching completes successfully, THE Activity_Section SHALL hide the loading indicator and display the data
3. WHEN an error occurs during data fetching, THE Activity_Section SHALL display an error state with an appropriate message
4. WHEN displaying an error state, THE Activity_Section SHALL provide context about the error type (rate limit, network, not found, or unknown)
5. WHEN an API_Error includes a retryAfter value, THE Activity_Section SHALL display the retry time to the user

### Requirement 11: Maintain Visual Consistency

**User Story:** As a portfolio visitor, I want the GitHub activity section to match the site's aesthetic, so that I have a cohesive visual experience.

#### Acceptance Criteria

1. THE Activity_Section SHALL use the existing dark/terminal color scheme with black background and white text
2. THE Streak_Card and Commits_Card SHALL use consistent spacing and typography with other portfolio sections
3. WHEN displaying numeric metrics, THE Activity_Section SHALL animate the numbers on initial load
4. THE Activity_Section SHALL use Framer Motion for card animations consistent with other sections
5. WHEN displaying commit messages longer than 60 characters, THE Commits_Card SHALL truncate the message with an ellipsis

### Requirement 12: Ensure Data Integrity

**User Story:** As a developer, I want data validation rules enforced, so that the application only processes valid data.

#### Acceptance Criteria

1. WHEN creating a StreakData object, THE GitHub_API_Service SHALL ensure currentStreak is greater than or equal to zero
2. WHEN creating a StreakData object, THE GitHub_API_Service SHALL ensure longestStreak is greater than or equal to currentStreak
3. WHEN creating a GitHubActivityData object, THE GitHub_API_Service SHALL ensure the commits array has a maximum length of 5
4. WHEN creating a CacheEntry object, THE Cache_Manager SHALL ensure the timestamp is a valid Unix timestamp
5. WHEN creating a CacheEntry object, THE Cache_Manager SHALL ensure expiresIn is a positive integer
6. WHEN validating cache validity, THE Cache_Manager SHALL return null if the current time minus timestamp exceeds expiresIn

### Requirement 13: Support Component Integration

**User Story:** As a developer, I want the GitHub activity component to integrate seamlessly into the existing page structure, so that it's easy to add to the portfolio.

#### Acceptance Criteria

1. THE Activity_Section SHALL accept a username prop as a required string parameter
2. THE Activity_Section SHALL accept an optional className prop for custom styling
3. THE Activity_Section SHALL be a client component compatible with Next.js App Router
4. THE Activity_Section SHALL handle its own data fetching without requiring parent component state management
5. THE Activity_Section SHALL clean up any side effects when unmounted

### Requirement 14: Implement Security Best Practices

**User Story:** As a security-conscious developer, I want the GitHub integration to follow security best practices, so that the application is protected from common vulnerabilities.

#### Acceptance Criteria

1. THE Activity_Section SHALL never use dangerouslySetInnerHTML for rendering commit messages
2. THE Cache_Manager SHALL never store authentication tokens or sensitive data in localStorage
3. WHEN making API requests, THE GitHub_API_Service SHALL use unauthenticated requests or proxy through a backend API route
4. THE GitHub_API_Service SHALL validate all API responses with TypeScript type guards before processing
5. WHEN processing user-generated content from commit messages, THE Activity_Section SHALL rely on React's automatic escaping for XSS prevention

### Requirement 15: Extract Recent Commits

**User Story:** As a developer, I want commit extraction to be reliable, so that visitors see accurate recent activity.

#### Acceptance Criteria

1. WHEN extracting commits from events, THE GitHub_API_Service SHALL filter events to include only PushEvent types
2. WHEN a PushEvent contains multiple commits, THE GitHub_API_Service SHALL extract all commits from the payload
3. WHEN extracting commits, THE GitHub_API_Service SHALL create a CommitInfo object with sha, message, repo, timestamp, and url fields
4. WHEN formatting commit URLs, THE GitHub_API_Service SHALL construct valid GitHub URLs in the format https://github.com/{repo}/commit/{sha}
5. WHEN the requested commit limit is N, THE GitHub_API_Service SHALL return at most N commits regardless of available events
