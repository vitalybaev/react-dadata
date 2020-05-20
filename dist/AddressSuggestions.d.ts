import { BaseProps, BaseSuggestions } from './BaseSuggestions';
import { DaDataAddress, DaDataAddressBounds } from './types';
declare type Dictionary = {
    [key: string]: any;
};
interface Props extends BaseProps<DaDataAddress> {
    fromBound?: DaDataAddressBounds;
    toBound?: DaDataAddressBounds;
    locations?: Dictionary[];
    locationsBoost?: Dictionary[];
}
export declare class AddressSuggestions extends BaseSuggestions<DaDataAddress, Props> {
    loadSuggestionsUrl: string;
    getLoadSuggestionsData: () => any;
}
export {};
