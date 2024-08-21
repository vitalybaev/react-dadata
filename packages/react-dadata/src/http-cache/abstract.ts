import type { SerializeCacheKeyPayload } from './types';

export abstract class HttpCache {
  /**
   * Получить данные из кеша
   * @param key - Уникальный ключ кеша
   * @example
   * ```ts
   * cache.get('key');
   * ```
   */
  public abstract get<T = unknown>(key: string): T | null;

  /**
   * Добавить данные в кеш
   * @param key - Уникальный ключ кеша
   * @param data - Данные для добавления
   * @example
   * ```ts
   * cache.set('key', { ok: true });
   * ```
   */
  public abstract set(key: string, data: unknown, ...rest: unknown[]): unknown;

  /**
   * Удалить закешированные данные по ключу
   * @param key - Уникальный ключ кеша
   * @xample
   * ```ts
   * cache.delete('key');
   * ```
   */
  public abstract delete(key: string): unknown;

  /**
   * Полностью очистить кеш
   */
  public abstract reset(): unknown;

  /**
   * Сгенерировать уникальный ключ кеша из параметров http-запроса
   * @example
   * ```ts
   * cache.serializeCacheKey({
   *   url: 'https://example.com',
   *   body: { key: "value" },
   *   method: "POST"
   * })
   * ```
   */
  public serializeCacheKey(payload: SerializeCacheKeyPayload): string {
    try {
      return JSON.stringify(payload);
    } catch (_e) {
      // на случай попытки сериализации объекта с циклическими зависимостями внутри
      return payload.url + String(Math.random());
    }
  }
}
