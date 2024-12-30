import type { DaDataSuggestion } from '../../core-types';

export type DaDataPartyKazakhstanStatus = 'ACTIVE' | 'INACTIVE' | 'LIQUIDATING' | 'LIQUIDATED' | 'SUSPENDED';

export type DaDataPartyKazakhstanType =
  | 'LEGAL'
  | 'BRANCH'
  | 'INDIVIDUAL'
  | 'INDIVIDUAL_JOINT_VENTURE'
  | 'FOREIGN_BRANCH';

export interface DaDataPartyKazakhstan {
  bin: string;
  registration_date: string;
  status: DaDataPartyKazakhstanStatus;
  type: DaDataPartyKazakhstanType;
  name_ru: string;
  name_kz: string;
  fio: string;
  kato: string;
  address_ru: string;
  address_kz: string;
  address_settlement_ru: string;
  address_settlement_kz: string;
  address_local: string;
  oked: string;
  oked_name_ru: string;
  oked_name_kz: string;
  krp: string;
  krp_name_ru: string;
  krp_name_kz: string;
  kse: string;
  kse_name_ru: string;
  kse_name_kz: string;
  kfs: string;
  kfs_name_ru: string;
  kfs_name_kz: string;
}

type DaDataPartyKazakhstanRequestFilterItem = { type: DaDataPartyKazakhstanType };

export interface DaDataPartyKazakhstanRequestPayload extends Record<string, unknown> {
  query: string;
  count: number;
  filters?: DaDataPartyKazakhstanRequestFilterItem[];
}

export type DaDataPartyKazakhstanSuggestion = DaDataSuggestion<DaDataPartyKazakhstan>;
