import { AddressSuggestions } from './AddressSuggestions';
import { BankSuggestions } from './BankSuggestions';
import { EmailSuggestions } from './EmailSuggestions';
import { FioSuggestions } from './FioSuggestions';
import { PartySuggestions } from './PartySuggestions';
import {
  DaDataAddress,
  DaDataAddressBounds,
  DaDataBank,
  DaDataBankStatus,
  DaDataBankType,
  DaDataEmail,
  DaDataFio,
  DaDataGender,
  DaDataParty,
  DaDataPartyBranchType,
  DaDataPartyStatus,
  DaDataPartyType,
  DaDataSuggestion,
} from './types';

type DaDataAddressSuggestion = DaDataSuggestion<DaDataAddress>;
type DaDataPartySuggestion = DaDataSuggestion<DaDataParty>;
type DaDataBankSuggestion = DaDataSuggestion<DaDataBank>;
type DaDataFioSuggestion = DaDataSuggestion<DaDataFio>;
type DaDataEmailSuggestion = DaDataSuggestion<DaDataEmail>;

export {
  DaDataSuggestion,
  AddressSuggestions,
  PartySuggestions,
  BankSuggestions,
  FioSuggestions,
  EmailSuggestions,
  DaDataAddress,
  type DaDataAddressSuggestion,
  DaDataParty,
  type DaDataPartySuggestion,
  DaDataAddressBounds,
  DaDataPartyType,
  DaDataPartyBranchType,
  DaDataPartyStatus,
  DaDataBank,
  DaDataBankStatus,
  DaDataBankType,
  type DaDataBankSuggestion,
  DaDataFio,
  type DaDataFioSuggestion,
  DaDataGender,
  DaDataEmail,
  type DaDataEmailSuggestion,
};
export { HttpCache } from './http-cache';
