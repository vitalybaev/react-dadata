import { HttpCache } from './abstract';
import type { HttpCacheEntry } from './types';

const minute = 60000;

export class DefaultHttpCache extends HttpCache {
  private static sharedInstance: DefaultHttpCache;

  private _map = new Map<string, HttpCacheEntry>();

  private _ttl = 10 * minute;

  /**
   * Синглтон
   * @example
   * ```ts
   * cache.shared.get('key');
   * ```
   */
  public static get shared(): DefaultHttpCache {
    if (!DefaultHttpCache.sharedInstance) {
      DefaultHttpCache.sharedInstance = new DefaultHttpCache();
    }
    return DefaultHttpCache.sharedInstance;
  }

  /**
   * Время жизни кеша в миллисекундах
   * @example
   * ```ts
   * cache.ttl = 60000;
   * cache.ttl = Infinity;
   * cache.tll = 0;
   *
   * // негативные значения игнорируются
   * cache.ttl = -1;
   * cache.ttl = Number.NEGATIVE_INFINITY;
   * ```
   */
  public get ttl(): number {
    return this._ttl;
  }

  public set ttl(ttl: number) {
    if (typeof ttl === 'number' && ttl >= 0) {
      this._ttl = ttl;
    }
  }

  /**
   * Количество элементов в кеше
   */
  public get size(): number {
    return this._map.size;
  }

  public get<T = unknown>(key: string) {
    const data = this._map.get(key);
    if (!data) return null;
    if (data.expires <= Date.now()) {
      this.delete(key);
      return null;
    }
    return data.data as T;
  }

  public set(key: string, data: unknown): this {
    this._map.set(key, {
      data,
      expires: Date.now() + this.ttl,
    });
    return this;
  }

  public delete(key: string): this {
    this._map.delete(key);
    return this;
  }

  public reset(): this {
    this._map.clear();
    return this;
  }
}
