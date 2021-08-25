/* eslint-disable camelcase */
import { ElementType, HTMLProps, ReactNode } from 'react';

type Nullable<T> = T | null;

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
  containerClassName?: string;
  suggestionsClassName?: string;
  suggestionClassName?: string;
  currentSuggestionClassName?: string;
  hintClassName?: string;
  highlightClassName?: string;
  minChars?: number;
  customInput?: ElementType;
}

export interface DaDataAddressMetro {
  name: string;
  line: string;
  distance: number;
}

export interface DaDataAddress {
  area: Nullable<string>;
  area_fias_id: Nullable<string>;
  area_kladr_id: Nullable<string>;
  area_type: Nullable<string>;
  area_type_full: Nullable<string>;
  area_with_type: Nullable<string>;
  beltway_distance: null;
  beltway_hit: null;
  block: Nullable<string>;
  block_type: Nullable<string>;
  block_type_full: Nullable<string>;
  federal_district: Nullable<string>;
  capital_marker: '0' | '1' | '2' | '3' | '4';
  city: Nullable<string>;
  city_area: Nullable<string>;
  city_district: Nullable<string>;
  city_district_fias_id: Nullable<string>;
  city_district_kladr_id: Nullable<string>;
  city_district_type: Nullable<string>;
  city_district_type_full: Nullable<string>;
  city_district_with_type: Nullable<string>;
  city_fias_id: Nullable<string>;
  city_kladr_id: Nullable<string>;
  city_type: Nullable<string>;
  city_type_full: Nullable<string>;
  city_with_type: Nullable<string>;
  country: string;
  country_iso_code: string;
  fias_id: string;
  fias_level: string;
  flat: Nullable<string>;
  flat_area: null;
  flat_price: null;
  flat_type: Nullable<string>;
  flat_type_full: Nullable<string>;
  geo_lat: Nullable<string>;
  geo_lon: Nullable<string>;
  geoname_id: Nullable<string>;
  history_values: Nullable<string[]>;
  house: Nullable<string>;
  house_fias_id: Nullable<string>;
  house_kladr_id: Nullable<string>;
  house_type: Nullable<string>;
  house_type_full: Nullable<string>;
  kladr_id: string;
  okato: Nullable<string>;
  oktmo: Nullable<string>;
  postal_box: Nullable<string>;
  postal_code: Nullable<string>;
  qc: null;
  qc_complete: null;
  qc_geo: Nullable<'0' | '1' | '2' | '3' | '4' | '5'>;
  qc_house: null;
  region: string;
  region_fias_id: string;
  region_kladr_id: string;
  region_type: string;
  region_type_full: string;
  region_with_type: string;
  settlement: Nullable<string>;
  settlement_fias_id: Nullable<string>;
  settlement_kladr_id: Nullable<string>;
  settlement_type: Nullable<string>;
  settlement_type_full: Nullable<string>;
  settlement_with_type: Nullable<string>;
  source: Nullable<string>;
  square_meter_price: null;
  street: Nullable<string>;
  street_fias_id: Nullable<string>;
  street_kladr_id: Nullable<string>;
  street_type: Nullable<string>;
  street_type_full: Nullable<string>;
  street_with_type: Nullable<string>;
  tax_office: Nullable<string>;
  tax_office_legal: Nullable<string>;
  timezone: Nullable<string>;
  unparsed_parts: null;
  fias_code: string;
  region_iso_code: string;
  fias_actuality_state: string;
  metro: Nullable<DaDataAddressMetro[]>;
}

export type DaDataAddressBounds = 'country' | 'region' | 'area' | 'city' | 'settlement' | 'street' | 'houses';

export type DaDataPartyType = 'LEGAL' | 'INDIVIDUAL';

export type DaDataPartyBranchType = 'MAIN' | 'BRANCH';

export type DaDataPartyStatus = 'ACTIVE' | 'LIQUIDATING' | 'LIQUIDATED' | 'REORGANIZING';

export interface DaDataParty {
  inn: string;
  kpp: string;
  ogrn: string;
  ogrn_date: number;
  hid: string;
  type: DaDataPartyType;
  name: {
    full_with_opf: string;
    short_with_opf: string;
    latin: Nullable<string>;
    full: string;
    short: string;
  };
  okpo: null;
  okved: string;
  okved_type: string;
  opf: {
    code: string;
    type: string;
    full: string;
    short: string;
  };
  management?: {
    name: string;
    post: string;
  };
  branch_count?: number;
  branch_type?: DaDataPartyBranchType;
  address: DaDataSuggestion<DaDataAddress>;
  state: {
    actuality_date: number;
    registration_date: number;
    liquidation_date: Nullable<number>;
    status: DaDataPartyStatus;
  };
}

export type DaDataBankType = 'BANK' | 'BANK_BRANCH' | 'NKO' | 'NKO_BRANCH' | 'RKC' | 'OTHER';

export type DaDataBankStatus = 'ACTIVE' | 'LIQUIDATING' | 'LIQUIDATED';

export interface DaDataBank {
  bic: string;
  swift: string;
  inn: string;
  kpp: string;
  registration_number: string;
  correspondent_account: string;
  name: {
    payment: string;
    full: null;
    short: string;
  };
  payment_city: string;
  opf: {
    type: DaDataBankType;
    full: null;
    short: null;
  };
  address: DaDataSuggestion<DaDataAddress>;
  state: {
    actuality_date: number;
    registration_date: number;
    liquidation_date: Nullable<number>;
    status: DaDataBankStatus;
  };
  okpo: null;
  phone: number;
  rkc: number;
}

export type DaDataGender = 'MALE' | 'FEMALE' | 'UNKNOWN';

export interface DaDataFio {
  surname: Nullable<string>;
  name: Nullable<string>;
  patronymic: Nullable<string>;
  gender: DaDataGender;
  qc: '0' | '1';
  source: null;
}
