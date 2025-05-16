import { NextResponse } from 'next/server';

// Simple in-memory cache implementation
const cache = new Map<string, { data: any; expiry: number }>();

/**
 * Get cached data with automatic expiration
 * @param key Cache key
 * @returns Cached data or null if not found or expired
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (cached.expiry > Date.now()) {
    return cached.data as T;
  }
  
  // Remove expired item
  cache.delete(key);
  return null;
}

/**
 * Set data in cache with expiration
 * @param key Cache key
 * @param data Data to cache
 * @param ttlSeconds Time to live in seconds
 */
export async function setCachedData(key: string, data: any, ttlSeconds: number): Promise<void> {
  const expiry = Date.now() + (ttlSeconds * 1000);
  cache.set(key, { data, expiry });
}

/**
 * Clear cache entry
 * @param key Cache key to clear
 */
export async function clearCachedData(key: string): Promise<void> {
  cache.delete(key);
}

/**
 * Clear all cache entries
 */
export async function clearAllCache(): Promise<void> {
  cache.clear();
}

// Cache middleware for server actions
export function withCache<T>(
  fn: (params: any) => Promise<T>,
  cacheKeyFn: (params: any) => string,
  ttlSeconds: number = 300 // Default 5 minutes
): (params: any) => Promise<T> {
  return async (params: any): Promise<T> => {
    const cacheKey = cacheKeyFn(params);
    const cachedData = await getCachedData<T>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const result = await fn(params);
      await setCachedData(cacheKey, result, ttlSeconds);
      return result;
    } catch (error) {
      // Clear cache on error to avoid serving stale data
      await clearCachedData(cacheKey);
      throw error;
    }
  };
}
