import {
  DaDataAddress,
  DaDataParty,
  DaDataSuggestion,
  DaDataAddressBounds,
  DaDataPartyType,
  DaDataPartyBranchType,
  DaDataPartyStatus,
  DaDataBank,
  DaDataBankStatus,
  DaDataBankType,
} from './types';
import { AddressSuggestions } from './AddressSuggestions';
import { PartySuggestions } from './PartySuggestions';
import { BankSuggestions } from './BankSuggestions';

type DaDataAddressSuggestion = DaDataSuggestion<DaDataAddress>;
type DaDataPartySuggestion = DaDataSuggestion<DaDataParty>;
type DaDataBankSuggestion = DaDataSuggestion<DaDataBank>;

export {
  DaDataSuggestion,
  AddressSuggestions,
  PartySuggestions,
  BankSuggestions,
  DaDataAddress,
  DaDataAddressSuggestion,
  DaDataParty,
  DaDataPartySuggestion,
  DaDataAddressBounds,
  DaDataPartyType,
  DaDataPartyBranchType,
  DaDataPartyStatus,
  DaDataBank,
  DaDataBankStatus,
  DaDataBankType,
};
