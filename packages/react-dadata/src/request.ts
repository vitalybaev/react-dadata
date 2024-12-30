import type { DaDataSuggestion } from './core-types';
import type { HttpCache } from './http-cache';

export interface RequestOptions {
  headers: { [header: string]: string };
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  json: any;
}

let xhr: XMLHttpRequest;

export const makeRequest = <SuggestionType>(
  method: string,
  endpoint: string,
  data: RequestOptions,
  cache: HttpCache | null,
  onReceiveData: (response: Array<DaDataSuggestion<SuggestionType>>) => void,
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
    const cachedData = cache.get(cacheKey) as Array<DaDataSuggestion<SuggestionType>>;
    if (cachedData) {
      onReceiveData(cachedData);
      return;
    }
  }
  xhr = new XMLHttpRequest();
  xhr.open(method, endpoint);
  if (data.headers) {
    for (const [header, headerValue] of Object.entries(data.headers)) {
      xhr.setRequestHeader(header, headerValue);
    }
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
