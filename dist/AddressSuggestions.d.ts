import { BaseProps, BaseSuggestions } from './BaseSuggestions';
import { DaDataAddress, DaDataAddressBounds, DaDataSuggestion } from './types';
declare type Dictionary = {
    [key: string]: any;
};
interface Props extends BaseProps<DaDataAddress> {
    filterFromBound?: DaDataAddressBounds;
    filterToBound?: DaDataAddressBounds;
    filterLocations?: Dictionary[];
    filterLocationsBoost?: Dictionary[];
}
export declare class AddressSuggestions extends BaseSuggestions<DaDataAddress, Props> {
    loadSuggestionsUrl: string;
    getLoadSuggestionsData: () => any;
    protected renderOption: (suggestion: DaDataSuggestion<DaDataAddress>) => {} | null | undefined;
}
export {};
