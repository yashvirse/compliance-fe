/**
 * Cache Manager - Handle data caching with TTL
 * Benefits: Reduced API calls, faster page navigation, better UX
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<any>>();

/**
 * Get cached data if not expired
 */
export function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  
  if (!entry) {
    console.log(`📦 Cache miss: ${key}`);
    return null;
  }

  const isExpired = Date.now() - entry.timestamp > entry.ttl;
  
  if (isExpired) {
    console.log(`⏰ Cache expired: ${key}`);
    cache.delete(key);
    return null;
  }

  console.log(`✅ Cache hit: ${key} (${Math.round((Date.now() - entry.timestamp) / 1000)}s old)`);
  return entry.data as T;
}

/**
 * Set cache data with TTL
 */
export function setCacheData<T>(
  key: string,
  data: T,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
  console.log(`💾 Cache set: ${key} (TTL: ${ttl / 1000}s)`);
}

/**
 * Clear specific cache key or all cache
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
    console.log(`🗑️  Cache cleared: ${key}`);
  } else {
    cache.clear();
    console.log(`🗑️  All cache cleared`);
  }
}

/**
 * Get cache info for debugging
 */
export function getCacheInfo() {
  const info: Record<string, any> = {};
  
  cache.forEach((entry, key) => {
    const ageMs = Date.now() - entry.timestamp;
    const isExpired = ageMs > entry.ttl;
    
    info[key] = {
      ageSeconds: Math.round(ageMs / 1000),
      ttlSeconds: Math.round(entry.ttl / 1000),
      isExpired,
      dataSize: JSON.stringify(entry.data).length,
    };
  });

  return {
    totalEntries: cache.size,
    entries: info,
  };
}

/**
 * Preload cache data
 */
export function preloadCache<T>(
  key: string,
  data: T,
  ttl: number
): void {
  setCacheData(key, data, ttl);
}
