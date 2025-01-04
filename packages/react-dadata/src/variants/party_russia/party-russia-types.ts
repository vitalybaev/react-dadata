import type { DaDataSuggestion, Nullable } from '../../core-types';
import type { DaDataAddress } from '../address/address-types';

export type DaDataPartyType = 'LEGAL' | 'INDIVIDUAL';

export type DaDataPartyStatus = 'ACTIVE' | 'LIQUIDATING' | 'LIQUIDATED' | 'REORGANIZING' | 'BANKRUPT';

export type DaDataPartyBranchType = 'MAIN' | 'BRANCH';

/**
 * @see https://dadata.ru/api/suggest/party/#response
 */
interface DaDataPartyAddress
  extends Omit<DaDataAddress, 'qc' | 'house_cadnum' | 'stead_kladr_id' | 'floor' | 'flat_price'> {
  qc: '0' | '1' | '3';
  house_cadnum: Nullable<string>;
  floor: Nullable<string>;
  flat_price: Nullable<string>;
}

export interface DaDataPartyRussiaFio {
  name: string;
  patronymic: string;
  surname: string;
  gender: null;
  qc: null;
  source: null;
}

export interface DaDataParty {
  inn: string;
  kpp: string;
  ogrn: string;
  ogrn_date: number;
  hid: string;
  capital: Nullable<string>;
  type: DaDataPartyType;
  fio?: DaDataPartyRussiaFio;
  name: {
    full_with_opf: string;
    short_with_opf: string;
    latin: Nullable<string>;
    full: string;
    short: string;
  };
  okpo: Nullable<string>;
  okato: Nullable<string>;
  oktmo: Nullable<string>;
  okogu: Nullable<string>;
  okfs: Nullable<string>;
  okved: string;
  okved_type: string;
  okveds: Nullable<string[]>;
  authorities: null;
  documents: null;
  licenses: null;
  phones: null;
  emails: null;
  employee_count: Nullable<string>;
  finance: Nullable<{
    tax_system: Nullable<string>;
    income: Nullable<string>;
    expense: Nullable<string>;
    debt: Nullable<string>;
    penalty: Nullable<string>;
    year: Nullable<string>;
  }>;
  opf: {
    code: string;
    type: string;
    full: string;
    short: string;
  };
  management?: Nullable<{
    name: string;
    post: string;
    disqualified: Nullable<string>;
  }>;
  founders: Nullable<string[]>;
  managers: Nullable<string[]>;
  predecessors: Nullable<string[]>;
  successors: Nullable<string[]>;
  branch_count?: number;
  branch_type?: DaDataPartyBranchType;
  address: DaDataSuggestion<DaDataPartyAddress>;
  state: {
    actuality_date: number;
    registration_date: number;
    liquidation_date: Nullable<number>;
    status: DaDataPartyStatus;
    // TODO: Добавить информацию по статусам
    // https://github.com/hflabs/party-state/blob/master/party-state.csv
    code: Nullable<string>;
  };
  source: null;
  qc: null;
}

export type DaDataPartySuggestion = DaDataSuggestion<DaDataParty>;

/**
 * Алиасы для типов по организациям в России 🇷🇺 для консистентности с другими странами
 */
export type DaDataPartyRussiaStatus = DaDataPartyStatus;
export type DaDataPartyRussiaType = DaDataPartyType;
export type DaDataPartyRussia = DaDataParty;
export type DaDataPartyRussiaSuggestion = DaDataSuggestion<DaDataPartyRussia>;
