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
  renderOption?: (suggestion: DaDataSuggestion<SuggestionType>) => ReactNode;
  optionClassName?: string;
  currentOptionClassName?: string;
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
