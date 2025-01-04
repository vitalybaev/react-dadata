import React, { type ReactNode } from 'react';
import { type BaseProps, BaseSuggestions } from '../../base-suggestions';
import { HighlightWords } from '../../highlight-words';
import type { DaDataAddress, DaDataAddressBounds, DaDataAddressSuggestion } from './address-types';

type Dictionary = Record<string, unknown>;

interface Props extends BaseProps<DaDataAddress> {
  filterLanguage?: 'ru' | 'en';
  filterFromBound?: DaDataAddressBounds;
  filterToBound?: DaDataAddressBounds;
  filterLocations?: Dictionary[];
  filterLocationsBoost?: Dictionary[];
  filterRestrictValue?: boolean;
}

export class AddressSuggestions extends BaseSuggestions<DaDataAddress, Props> {
  loadSuggestionsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';

  getLoadSuggestionsData = (): Record<string, unknown> => {
    const {
      count,
      filterFromBound,
      filterToBound,
      filterLocations,
      filterLocationsBoost,
      filterLanguage,
      filterRestrictValue,
    } = this.props;
    const { query } = this.state;

    // TODO: Type this params
    const requestPayload: Record<string, unknown> = {
      query,
      count: count || 10,
    };

    // Ограничение поиска по типу
    if (filterFromBound && filterToBound) {
      requestPayload.from_bound = { value: filterFromBound };
      requestPayload.to_bound = { value: filterToBound };
    }

    // Язык подсказок
    if (filterLanguage) {
      requestPayload.language = filterLanguage;
    }

    // Сужение области поиска
    if (filterLocations) {
      requestPayload.locations = filterLocations;
    }

    // Приоритет города при ранжировании
    if (filterLocationsBoost) {
      requestPayload.locations_boost = filterLocationsBoost;
    }

    // @see https://confluence.hflabs.ru/pages/viewpage.action?pageId=1023737934
    if (filterRestrictValue) {
      requestPayload.restrict_value = true;
    }

    return requestPayload;
  };

  protected renderOption = (suggestion: DaDataAddressSuggestion): ReactNode => {
    const { renderOption, highlightClassName } = this.props;
    const { query } = this.state;

    return renderOption ? (
      renderOption(suggestion, query)
    ) : (
      <HighlightWords
        highlightClassName={highlightClassName || 'react-dadata--highlighted'}
        words={this.getHighlightWords()}
        tagName="mark"
        text={suggestion.value}
      />
    );
  };
}
