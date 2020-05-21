import { BaseProps, BaseSuggestions } from './BaseSuggestions';
import { DaDataParty, DaDataPartyStatus, DaDataPartyType, DaDataSuggestion } from './types';
declare type Dictionary = {
    [key: string]: any;
};
interface Props extends BaseProps<DaDataParty> {
    filterStatus?: DaDataPartyStatus[];
    filterType?: DaDataPartyType;
    filterLocations?: Dictionary[];
    filterLocationsBoost?: Dictionary[];
}
export declare class PartySuggestions extends BaseSuggestions<DaDataParty, Props> {
    loadSuggestionsUrl: string;
    getLoadSuggestionsData: () => any;
    protected getSuggestionKey: (suggestion: DaDataSuggestion<DaDataParty>) => string;
    protected renderOption: (suggestion: DaDataSuggestion<DaDataParty>) => {} | null | undefined;
}
export {};
