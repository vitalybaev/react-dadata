import type { DaDataSuggestion, Nullable } from '../../core-types';

export interface DaDataEmail {
  local: Nullable<string>;
  domain: Nullable<string>;
  // type, qc и source зарезервированы для стандартизации и приходят как null в подсказках
  type: null;
  qc: null;
  source: null;
}

export type DaDataEmailSuggestion = DaDataSuggestion<DaDataEmail>;
