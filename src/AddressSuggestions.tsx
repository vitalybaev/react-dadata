import { BaseProps, BaseSuggestions } from './BaseSuggestions';
import { DaDataAddress, DaDataAddressBounds } from './types';

type Dictionary = { [key: string]: any };

interface Props extends BaseProps<DaDataAddress> {
  fromBound?: DaDataAddressBounds;
  toBound?: DaDataAddressBounds;
  locations?: Dictionary[];
  locationsBoost?: Dictionary[];
}

export class AddressSuggestions extends BaseSuggestions<DaDataAddress, Props> {
  loadSuggestionsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';

  getLoadSuggestionsData = () => {
    const { count, fromBound, toBound, locations, locationsBoost } = this.props;
    const { query } = this.state;

    const requestPayload: any = {
      query,
      count: count || 10,
    };

    // Ограничение поиска по типу
    if (fromBound && toBound) {
      requestPayload.from_bound = { value: fromBound };
      requestPayload.to_bound = { value: toBound };
    }

    // Сужение области поиска
    if (locations) {
      requestPayload.locations = locations;
    }

    // Приоритет города при ранжировании
    if (locationsBoost) {
      requestPayload.locations_boost = locationsBoost;
    }

    return requestPayload;
  }
}
