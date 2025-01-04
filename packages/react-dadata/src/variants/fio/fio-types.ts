import type { DaDataSuggestion, Nullable } from '../../core-types';

export type DaDataGender = 'MALE' | 'FEMALE' | 'UNKNOWN';

export interface DaDataFio {
  surname: Nullable<string>;
  name: Nullable<string>;
  patronymic: Nullable<string>;
  gender: DaDataGender;
  qc: '0' | '1';
  source: null;
}

export type DaDataFioSuggestion = DaDataSuggestion<DaDataFio>;
