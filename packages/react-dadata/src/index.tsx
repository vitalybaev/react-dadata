import { AddressSuggestions } from './AddressSuggestions';
import { BankSuggestions } from './BankSuggestions';
import { EmailSuggestions } from './EmailSuggestions';
import { FioSuggestions } from './FioSuggestions';
import { PartySuggestions } from './PartySuggestions';
import type {
  DaDataAddress,
  DaDataAddressBounds,
  DaDataBank,
  DaDataBankStatus,
  DaDataBankType,
  DaDataEmail,
  DaDataFio,
  DaDataGender,
  DaDataParty,
  DaDataPartyBelarus,
  DaDataPartyBelarusStatus,
  DaDataPartyBranchType,
  DaDataPartyRussia,
  DaDataPartyRussiaStatus,
  DaDataPartyStatus,
  DaDataPartyType,
  DaDataSuggestion,
} from './types';
import { PartyBelarusSuggestions } from './variants/party_belarus/party-belarus';

type DaDataAddressSuggestion = DaDataSuggestion<DaDataAddress>;
type DaDataPartySuggestion = DaDataSuggestion<DaDataParty>;
type DaDataPartyRussiaSuggestion = DaDataSuggestion<DaDataPartyRussia>;
type DaDataPartyBelarusSuggestion = DaDataSuggestion<DaDataPartyBelarus>;
type DaDataBankSuggestion = DaDataSuggestion<DaDataBank>;
type DaDataFioSuggestion = DaDataSuggestion<DaDataFio>;
type DaDataEmailSuggestion = DaDataSuggestion<DaDataEmail>;

export {
  type DaDataSuggestion,
  AddressSuggestions,
  PartySuggestions,
  PartyBelarusSuggestions,
  BankSuggestions,
  FioSuggestions,
  EmailSuggestions,
  type DaDataAddress,
  type DaDataAddressSuggestion,
  type DaDataParty,
  type DaDataPartySuggestion,
  type DaDataPartyRussiaSuggestion,
  type DaDataPartyBelarusSuggestion,
  type DaDataAddressBounds,
  type DaDataPartyType,
  type DaDataPartyRussia,
  type DaDataPartyRussiaStatus,
  type DaDataPartyBranchType,
  type DaDataPartyStatus,
  type DaDataPartyBelarus,
  type DaDataPartyBelarusStatus,
  type DaDataBank,
  type DaDataBankStatus,
  type DaDataBankType,
  type DaDataBankSuggestion,
  type DaDataFio,
  type DaDataFioSuggestion,
  type DaDataGender,
  type DaDataEmail,
  type DaDataEmailSuggestion,
};
export { HttpCache } from './http-cache';
