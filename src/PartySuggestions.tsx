import React, { ReactNode } from 'react';
import { BaseProps, BaseSuggestions } from './BaseSuggestions';
import { DaDataParty, DaDataPartyStatus, DaDataPartyType, DaDataSuggestion } from './types';
import { HighlightWords } from './HighlightWords';

type Dictionary = { [key: string]: any };

interface Props extends BaseProps<DaDataParty> {
  filterStatus?: DaDataPartyStatus[];
  filterType?: DaDataPartyType;
  filterOkved?: string[];
  filterLocations?: Dictionary[];
  filterLocationsBoost?: Dictionary[];
}

export class PartySuggestions extends BaseSuggestions<DaDataParty, Props> {
  loadSuggestionsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party';

  getLoadSuggestionsData = (): Record<string, unknown> => {
    const { count, filterStatus, filterType, filterOkved, filterLocations, filterLocationsBoost } = this.props;
    const { query } = this.state;

    const requestPayload: Record<string, unknown> = {
      query,
      count: count || 10,
    };

    // Ограничение по статусу организации
    if (filterStatus) {
      requestPayload.status = filterStatus;
    }

    // Ограничение по ОКВЭД
    // @see https://confluence.hflabs.ru/pages/viewpage.action?pageId=1093075333
    if (filterOkved) {
      requestPayload.okved = filterOkved;
    }

    // Ограничение по типу организации
    if (filterType) {
      requestPayload.type = filterType;
    }

    // Сужение области поиска
    if (filterLocations) {
      requestPayload.locations = filterLocations;
    }

    // Приоритет города при ранжировании
    if (filterLocationsBoost) {
      requestPayload.locations_boost = filterLocationsBoost;
    }

    return requestPayload;
  };

  protected getSuggestionKey = (suggestion: DaDataSuggestion<DaDataParty>): string => suggestion.data.hid;

  protected renderOption = (suggestion: DaDataSuggestion<DaDataParty>): ReactNode => {
    const { renderOption, highlightClassName } = this.props;
    const { query } = this.state;

    return renderOption ? (
      renderOption(suggestion, query)
    ) : (
      <div>
        <div
          className={
            suggestion.data.state.status === 'LIQUIDATED' ? 'react-dadata__suggestion--line-through' : undefined
          }
        >
          <HighlightWords
            highlightClassName={highlightClassName || 'react-dadata--highlighted'}
            words={this.getHighlightWords()}
            text={suggestion.value}
          />
        </div>
        <div className="react-dadata__suggestion-subtitle">
          {suggestion.data.inn && <div className="react-dadata__suggestion-subtitle-item">{suggestion.data.inn}</div>}
          {suggestion.data.address && suggestion.data.address.value && (
            <div className="react-dadata__suggestion-subtitle-item">
              <HighlightWords
                highlightClassName={highlightClassName || 'react-dadata--highlighted'}
                words={this.getHighlightWords()}
                text={suggestion.data.address.value}
              />
            </div>
          )}
        </div>
      </div>
    );
  };
}
