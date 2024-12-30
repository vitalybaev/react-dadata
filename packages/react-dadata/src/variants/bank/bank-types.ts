import type { DaDataSuggestion, Nullable } from '../../core-types';
import type { DaDataAddress } from '../../variants/address/address-types';

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

export type DaDataBankSuggestion = DaDataSuggestion<DaDataBank>;
