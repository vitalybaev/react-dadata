import React, { type ReactNode } from 'react';
import { type BaseProps, BaseSuggestions } from '../../base-suggestions';
import { HighlightWords } from '../../highlight-words';
import type {
  DaDataPartyBelarus,
  DaDataPartyBelarusStatus,
  DaDataPartyBelarusSuggestion,
  DaDataPartyBelarusType,
} from './party-belarus-types';
import type { DaDataBelarusRequestPayload } from './party-belarus-types';

interface Props extends BaseProps<DaDataPartyBelarus> {
  filterStatus?: DaDataPartyBelarusStatus[];
  filterType?: DaDataPartyBelarusType[];
}

export class PartyBelarusSuggestions extends BaseSuggestions<DaDataPartyBelarus, Props, DaDataBelarusRequestPayload> {
  loadSuggestionsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party_by';

  /**
   * Структура запроса для подсказок по организациям в Беларуси 🇧🇾
   * @see https://dadata.ru/api/suggest/party_by/
   */
  getLoadSuggestionsData = () => {
    const { count, filterStatus, filterType } = this.props;
    const { query } = this.state;

    const requestPayload: DaDataBelarusRequestPayload = {
      query,
      count: count || 10,
      filters: [],
    };

    // Ограничение по статусу организации
    if (filterStatus) {
      for (let i = 0; i < filterStatus.length; i++) {
        requestPayload.filters?.push({
          status: filterStatus[i],
        });
      }
    }

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
  // В Беларуси такого свойства нет, поэтому используем UNP + full_name_by + registration_date
  protected getSuggestionKey = (suggestion: DaDataPartyBelarusSuggestion): string =>
    suggestion.data.unp + suggestion.data.full_name_by + suggestion.data.registration_date;

  protected renderOption = (suggestion: DaDataPartyBelarusSuggestion): ReactNode => {
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
          {suggestion.data.address && (
            <div className="react-dadata__suggestion-subtitle-item">
              <HighlightWords
                highlightClassName={highlightClassName || 'react-dadata--highlighted'}
                words={this.getHighlightWords()}
                text={suggestion.data.address}
              />
            </div>
          )}
        </div>
      </div>
    );
  };
}
