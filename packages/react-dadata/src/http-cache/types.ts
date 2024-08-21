export interface HttpCacheEntry {
  data: unknown;
  expires: number;
}

export interface SerializeCacheKeyPayload {
  headers?: Record<string, string>;
  method?: string;
  url: string;
  body?: Record<string, unknown>;
}
