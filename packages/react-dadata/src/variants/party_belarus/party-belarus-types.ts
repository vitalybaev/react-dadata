import type { DaDataSuggestion, Nullable } from '../../core-types';

/**
 * Типы для подсказок по организациям в Беларуси 🇧🇾
 */

export type DaDataPartyBelarusType = 'LEGAL' | 'INDIVIDUAL';

export type DaDataPartyBelarusStatus =
  | 'ACTIVE'
  | 'LIQUIDATING'
  | 'LIQUIDATED'
  | 'REORGANIZING'
  | 'BANKRUPT'
  | 'SUSPENDED';

export interface DaDataPartyBelarus {
  unp: string;
  registration_date: string;
  removal_date: Nullable<string>;
  actuality_date: string;
  status: DaDataPartyBelarusStatus;
  type: DaDataPartyBelarusType;
  full_name_ru: string;
  full_name_by: Nullable<string>;
  short_name_ru: Nullable<string>;
  short_name_by: Nullable<string>;
  trade_name_ru: Nullable<string>;
  trade_name_by: Nullable<string>;
  fio_ru: Nullable<string>;
  fio_by: Nullable<string>;
  address: Nullable<string>;
  oked: string;
  oked_name: string;
}

type DaDataBelarusRequestFilterItem = { status: DaDataPartyBelarusStatus } | { type: DaDataPartyBelarusType };

export interface DaDataBelarusRequestPayload extends Record<string, unknown> {
  query: string;
  count: number;
  filters?: DaDataBelarusRequestFilterItem[];
}

export type DaDataPartyBelarusSuggestion = DaDataSuggestion<DaDataPartyBelarus>;
