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
  DaDataFio,
  DaDataGender,
} from './types';
import { AddressSuggestions } from './AddressSuggestions';
import { PartySuggestions } from './PartySuggestions';
import { BankSuggestions } from './BankSuggestions';
import { FioSuggestions } from './FioSuggestions';

type DaDataAddressSuggestion = DaDataSuggestion<DaDataAddress>;
type DaDataPartySuggestion = DaDataSuggestion<DaDataParty>;
type DaDataBankSuggestion = DaDataSuggestion<DaDataBank>;
type DaDataFioSuggestion = DaDataSuggestion<DaDataFio>;

export {
  DaDataSuggestion,
  AddressSuggestions,
  PartySuggestions,
  BankSuggestions,
  FioSuggestions,
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
  DaDataBankSuggestion,
  DaDataFio,
  DaDataFioSuggestion,
  DaDataGender,
};
