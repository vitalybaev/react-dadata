import type { ElementType, HTMLProps, ReactNode } from 'react';
import type { HttpCache } from './http-cache';

export type Nullable<T> = T | null;

export interface DaDataSuggestion<T> {
  value: string;
  unrestricted_value: string;
  data: T;
}

/**
 * Общие пропсы для всех видов компонента подсказов
 */
export interface CommonProps<SuggestionType> {
  token: string;
  value?: DaDataSuggestion<SuggestionType>;
  url?: string;
  defaultQuery?: string;
  autoload?: boolean;
  delay?: number;
  count?: number;
  onChange?: (suggestion?: DaDataSuggestion<SuggestionType>) => void;
  inputProps?: HTMLProps<HTMLInputElement>;
  hintText?: ReactNode;
  renderOption?: (suggestion: DaDataSuggestion<SuggestionType>, inputValue: string) => ReactNode;
  renderNoSuggestions?: () => ReactNode;
  containerClassName?: string;
  suggestionsClassName?: string;
  suggestionClassName?: string;
  currentSuggestionClassName?: string;
  hintClassName?: string;
  highlightClassName?: string;
  minChars?: number;
  customInput?: ElementType;
  selectOnBlur?: boolean;
  uid?: string;
  /**
   * Необходимо ли кешировать HTTP-запросы?
   * Возможно передать собственный кеш наследующий {@link HttpCache}.
   */
  httpCache?: boolean | HttpCache;
  /**
   * Время жизни кеша в миллисекундах.
   * Игнорируется если был передан собственный {@link HttpCache}.
   */
  httpCacheTtl?: number;
  children?: ReactNode | undefined;
}
