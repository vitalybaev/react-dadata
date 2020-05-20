import { BaseSuggestions } from './BaseSuggestions';
import { DaDataAddress } from './types';
export declare class AddressSuggestions extends BaseSuggestions<DaDataAddress> {
    loadSuggestionsUrl: string;
    getLoadSuggestionsData: () => any;
}
