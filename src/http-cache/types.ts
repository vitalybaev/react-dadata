export interface HttpCacheEntry {
  data: any;
  expires: number;
}

export interface SerializeCacheKeyPayload {
  headers?: Record<string, string>;
  method?: string;
  url: string;
  body?: Record<string, any>;
}
