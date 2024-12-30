import React, { type ReactNode } from 'react';
import { type BaseProps, BaseSuggestions } from '../../BaseSuggestions';
import { HighlightWords } from '../../HighlightWords';
import type { DaDataSuggestion } from '../../types';
import type {
  DaDataPartyKazakhstan,
  DaDataPartyKazakhstanRequestPayload,
  DaDataPartyKazakhstanType,
} from './party-kazakhstan-types';

interface Props extends BaseProps<DaDataPartyKazakhstan> {
  filterType?: DaDataPartyKazakhstanType[];
}

export class PartyKazakhstanSuggestions extends BaseSuggestions<
  DaDataPartyKazakhstan,
  Props,
  DaDataPartyKazakhstanRequestPayload
> {
  loadSuggestionsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party_kz';

  /**
   * Структура запроса для подсказок по организациям в Казахстане 🇰🇿
   * @see https://dadata.ru/api/suggest/party_kz/
   */
  getLoadSuggestionsData = () => {
    const { count, filterType } = this.props;
    const { query } = this.state;

    const requestPayload: DaDataPartyKazakhstanRequestPayload = {
      query,
      count: count || 10,
      filters: [],
    };

    // Ограничение по типу организации
    if (filterType) {
      for (let i = 0; i < filterType.length; i++) {
        requestPayload.filters?.push({
          type: filterType[i],
        });
      }
    }

    return requestPayload;
  };

  // В России ИНН допускает коллизии, и там существует свойство hid
  // В Казахстане такого свойства нет, поэтому используем БИН + name_kz + registration_date
  protected getSuggestionKey = (suggestion: DaDataSuggestion<DaDataPartyKazakhstan>): string =>
    suggestion.data.bin + suggestion.data.name_kz + suggestion.data.registration_date;

  protected renderOption = (suggestion: DaDataSuggestion<DaDataPartyKazakhstan>): ReactNode => {
    const { renderOption, highlightClassName } = this.props;
    const { query } = this.state;

    return renderOption ? (
      renderOption(suggestion, query)
    ) : (
      <div>
        <div className={suggestion.data.status === 'LIQUIDATED' ? 'react-dadata__suggestion--line-through' : undefined}>
          <HighlightWords
            highlightClassName={highlightClassName || 'react-dadata--highlighted'}
            words={this.getHighlightWords()}
            text={suggestion.value}
          />
        </div>
        <div className="react-dadata__suggestion-subtitle">
          {suggestion.data.address_ru && (
            <div className="react-dadata__suggestion-subtitle-item">
              <HighlightWords
                highlightClassName={highlightClassName || 'react-dadata--highlighted'}
                words={this.getHighlightWords()}
                text={suggestion.data.address_ru}
              />
            </div>
          )}
        </div>
      </div>
    );
  };
}
