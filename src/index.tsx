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
  DaDataEmail,
} from './types';
import { AddressSuggestions } from './AddressSuggestions';
import { PartySuggestions } from './PartySuggestions';
import { BankSuggestions } from './BankSuggestions';
import { FioSuggestions } from './FioSuggestions';
import { EmailSuggestions } from './EmailSuggestions';

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
  DaDataEmail,
  DaDataEmailSuggestion,
};
export { HttpCache } from './http-cache';
