import {
  DaDataAddress,
  DaDataParty,
  DaDataSuggestion,
  DaDataAddressBounds,
  DaDataPartyType,
  DaDataPartyBranchType,
  DaDataPartyStatus,
} from './types';
import { AddressSuggestions } from './AddressSuggestions';
import { PartySuggestions } from './PartySuggestions';

type DaDataAddressSuggestion = DaDataSuggestion<DaDataAddress>;
type DaDataPartySuggestion = DaDataSuggestion<DaDataParty>;

export {
  AddressSuggestions,
  PartySuggestions,
  DaDataAddress,
  DaDataAddressSuggestion,
  DaDataParty,
  DaDataPartySuggestion,
  DaDataAddressBounds,
  DaDataPartyType,
  DaDataPartyBranchType,
  DaDataPartyStatus,
};
