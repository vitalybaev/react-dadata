import { HTMLProps, ReactNode } from 'react';

/**
 * Общие пропсы для всех видов компонента подсказов
 */
export interface CommonProps<SuggestionType> {
  token: string;
  value?: DaDataSuggestion<SuggestionType>;
  defaultQuery?: string;
  autoload?: boolean;
  count?: number;
  onChange?: (suggestion?: DaDataSuggestion<SuggestionType>) => void;
  inputProps?: HTMLProps<HTMLInputElement>;
  hintText?: ReactNode;
  renderOption?: (suggestion: DaDataSuggestion<SuggestionType>) => ReactNode;
  containerClassName?: string;
  suggestionsClassName?: string;
  suggestionClassName?: string;
  currentSuggestionClassName?: string;
  hintClassName?: string;
  highlightClassName?: string;
}

type Nullable<T> = T | null;

export interface DaDataSuggestion<T> {
  value: string;
  unrestricted_value: string;
  data: T;
}

export interface DaDataAddress {
  area: string;
  area_fias_id: string;
  area_kladr_id: string;
  area_type: string;
  area_type_full: string;
  area_with_type: string;
  beltway_distance: null;
  beltway_hit: null;
  block: string;
  block_type: string;
  block_type_full: string;
  federal_district: Nullable<string>;
  capital_marker: '0' | '1' | '2' | '3' | '4';
  city: string;
  city_area: string;
  city_district: string;
  city_district_fias_id: string;
  city_district_kladr_id: string;
  city_district_type: string;
  city_district_type_full: string;
  city_district_with_type: string;
  city_fias_id: string;
  city_kladr_id: string;
  city_type: string;
  city_type_full: string;
  city_with_type: string;
  country: string;
  country_iso_code: string;
  fias_id: string;
  fias_level: string;
  flat: string;
  flat_area: null;
  flat_price: null;
  flat_type: string;
  flat_type_full: string;
  geo_lat: string;
  geo_lon: string;
  geoname_id: Nullable<number>;
  history_values: Nullable<string[]>;
  house: string;
  house_fias_id: string;
  house_kladr_id: string;
  house_type: string;
  house_type_full: string;
  kladr_id: string;
  okato: string;
  oktmo: string;
  postal_box: string;
  postal_code: Nullable<string>;
  qc: null;
  qc_complete: null;
  qc_geo: '0' | '1' | '2' | '3' | '4' | '5';
  qc_house: null;
  region: string;
  region_fias_id: string;
  region_kladr_id: string;
  region_type: string;
  region_type_full: string;
  region_with_type: string;
  settlement: string;
  settlement_fias_id: string;
  settlement_kladr_id: string;
  settlement_type: string;
  settlement_type_full: string;
  settlement_with_type: string;
  source: string;
  square_meter_price: null;
  street: string;
  street_fias_id: string;
  street_kladr_id: string;
  street_type: string;
  street_type_full: string;
  street_with_type: string;
  tax_office: string;
  tax_office_legal: string;
  timezone: Nullable<string>;
  unparsed_parts: null;
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
