import { BaseSuggestions } from './BaseSuggestions';
import { DaDataAddress } from './types';

export class AddressSuggestions extends BaseSuggestions<DaDataAddress> {
  loadSuggestionsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';

  getLoadSuggestionsData = () => {
    const requestPayload: any = {
      query: this.state.query,
      count: this.props.count ? this.props.count : 10,
    };

    return requestPayload;
  }
}
