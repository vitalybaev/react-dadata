import type { HttpCache } from './http-cache';

export interface RequestOptions {
  headers: { [header: string]: string };
  json: any;
}

let xhr: XMLHttpRequest;

export const makeRequest = (
  method: string,
  endpoint: string,
  data: RequestOptions,
  cache: HttpCache | null,
  onReceiveData: (response: any) => void,
): void => {
  if (xhr) {
    xhr.abort();
  }

  let cacheKey: string;
  if (cache) {
    cacheKey = cache.serializeCacheKey({
      headers: data.headers,
      body: data.json,
      url: endpoint,
      method,
    });
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      onReceiveData(cachedData);
      return;
    }
  }
  xhr = new XMLHttpRequest();
  xhr.open(method, endpoint);
  if (data.headers) {
    Object.entries(data.headers).forEach(([header, headerValue]) => {
      xhr.setRequestHeader(header, headerValue);
    });
  }
  xhr.send(JSON.stringify(data.json));

  xhr.onreadystatechange = () => {
    if (!xhr || xhr.readyState !== 4) {
      return;
    }

    if (xhr.status === 200) {
      const payload = JSON.parse(xhr.response)?.suggestions;
      if (payload) {
        cache?.set(cacheKey, payload);
        onReceiveData(payload);
      }
    }
  };
};
