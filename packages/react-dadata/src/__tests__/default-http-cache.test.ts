import { describe, expect, it } from 'vitest';
import { DefaultHttpCache as Cache } from '../http-cache';

describe('DefaultHttpCache', () => {
  const createCacheWithInfinityTtl = () => {
    const cache = new Cache();
    cache.ttl = Number.POSITIVE_INFINITY;
    return cache;
  };

  it('should return the same singleton instance on every call', () => {
    expect(Cache.shared).toBeInstanceOf(Cache);
    expect(Cache.shared).toBe(Cache.shared);
    expect(new Cache()).not.toBe(Cache.shared);
  });

  it('should serialize http payload to a string', () => {
    const cache = createCacheWithInfinityTtl();
    const payload = {
      method: 'GET',
      headers: { hello: 'world' },
      body: { hi: 'there' },
      url: 'https://example.com',
    };
    const key = cache.serializeCacheKey(payload);
    expect(typeof key).toBe('string');
    expect(cache.serializeCacheKey(payload)).toBe(key);
    expect(
      cache.serializeCacheKey({
        ...payload,
        url: 'https://example2.com',
      }),
    ).not.toBe(key);
    expect(cache.serializeCacheKey({ ...payload })).toBe(key);
  });

  it('should update ttl only if one is valid', () => {
    const cache = new Cache();
    cache.ttl = 0;
    expect(cache.ttl).toBe(0);
    cache.ttl = Number.POSITIVE_INFINITY;
    expect(cache.ttl).toBe(Number.POSITIVE_INFINITY);
    cache.ttl = 10;
    expect(cache.ttl).toBe(10);
    cache.ttl = -1;
    expect(cache.ttl).toBe(10);
    cache.ttl = true as unknown as number;
    expect(cache.ttl).toBe(10);
  });

  it('should insert new cache entries', () => {
    const cache = createCacheWithInfinityTtl();
    expect(cache.set('key', 1).get('key')).toBe(1);
    expect(cache.set('key2', { hello: 'world' }).get('key2')).toStrictEqual({ hello: 'world' });
  });

  it('should delete cache entries', () => {
    const cache = createCacheWithInfinityTtl();
    cache.set('key2', 2);
    expect(cache.set('key', 1).delete('key').get('key')).toBeNull();
    expect(cache.get('key2')).toBe(2);
  });

  it('should clear cache', () => {
    const cache = createCacheWithInfinityTtl();
    cache.set('key', 1).set('key2', 2);
    expect(cache.size).toBe(2);
    cache.reset();
    expect(cache.size).toBe(0);
  });

  it('should delete cache entries after their expiration', () =>
    new Promise<void>((done) => {
      const cache = createCacheWithInfinityTtl();
      cache.set('key', 1);
      cache.ttl = 0;
      cache.set('key2', 2);
      cache.ttl = 25;
      cache.set('key3', 3);
      cache.ttl = 100;
      cache.set('key4', 4);

      setTimeout(() => {
        expect(cache.get('key')).toBe(1);
        expect(cache.get('key2')).toBeNull();
        expect(cache.get('key3')).toBeNull();
        expect(cache.get('key4')).toBe(4);
        done();
      }, 50);
    }));
});
