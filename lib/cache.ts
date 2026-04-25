/**
 * Cache management utilities for client-side data storage
 * 
 * Provides functions for storing and retrieving data from browser localStorage
 * with automatic expiration handling and error containment.
 */

import { CacheEntry } from './github/types';

/**
 * Retrieves cached data from localStorage
 * 
 * @template T The type of data being retrieved
 * @param key The localStorage key
 * @returns The cached data if valid and not expired, null otherwise
 * 
 * @precondition key is non-empty string
 * @postcondition Returns valid data or null, never throws errors
 */
export function getCachedData<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    
    if (item === null) {
      return null;
    }
    
    const cacheEntry: CacheEntry<T> = JSON.parse(item);
    const now = Date.now();
    
    // Check if expired
    if (now - cacheEntry.timestamp > cacheEntry.expiresIn) {
      localStorage.removeItem(key);
      return null;
    }
    
    return cacheEntry.data;
    
  } catch (error) {
    // Invalid JSON or localStorage error - return null without throwing
    return null;
  }
}

/**
 * Stores data in localStorage with expiration metadata
 * 
 * @template T The type of data being stored
 * @param key The localStorage key
 * @param data The data to cache
 * @param expiresIn Cache expiration duration in milliseconds
 * 
 * @precondition key is non-empty string
 * @precondition data is serializable to JSON
 * @precondition expiresIn is positive integer
 * @postcondition Data is stored with timestamp and expiration, or error is logged
 */
export function setCachedData<T>(key: string, data: T, expiresIn: number): void {
  try {
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn
    };
    
    localStorage.setItem(key, JSON.stringify(cacheEntry));
    
  } catch (error) {
    // localStorage quota exceeded or other error
    console.warn(`Failed to cache data for key "${key}":`, error);
    // Don't throw - allow application to continue without caching
  }
}

/**
 * Clears a specific cache entry if it has expired
 * 
 * @param key The localStorage key to check and clear if expired
 * 
 * @precondition key is non-empty string
 * @postcondition Expired entry is removed, valid entry is preserved
 */
export function clearExpiredCache(key: string): void {
  try {
    const item = localStorage.getItem(key);
    if (!item) return;
    
    const cacheEntry = JSON.parse(item);
    const now = Date.now();
    
    // Check if expired and remove
    if (now - cacheEntry.timestamp > cacheEntry.expiresIn) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    // Invalid cache entry or localStorage error - remove it
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore removal errors
    }
  }
}

/**
 * Clears old cache entries to free up localStorage space
 * 
 * @param keyPrefix Optional prefix to filter which keys to clear
 */
export function clearOldCacheEntries(keyPrefix?: string): void {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      // Filter by prefix if provided
      if (keyPrefix && !key.startsWith(keyPrefix)) continue;
      
      try {
        const item = localStorage.getItem(key);
        if (!item) continue;
        
        const cacheEntry = JSON.parse(item);
        const now = Date.now();
        
        // Check if expired
        if (now - cacheEntry.timestamp > cacheEntry.expiresIn) {
          keysToRemove.push(key);
        }
      } catch {
        // Invalid cache entry - mark for removal
        keysToRemove.push(key);
      }
    }
    
    // Remove expired entries
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    if (keysToRemove.length > 0) {
      console.log(`Cleared ${keysToRemove.length} expired cache entries`);
    }
    
  } catch (error) {
    console.warn('Failed to clear old cache entries:', error);
  }
}
