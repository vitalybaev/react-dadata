import React, { ReactNode } from 'react';
import { BaseProps, BaseSuggestions } from './BaseSuggestions';
import { DaDataEmail, DaDataSuggestion } from './types';
import { HighlightWords } from './HighlightWords';

type Props = BaseProps<DaDataEmail>;

export class EmailSuggestions extends BaseSuggestions<DaDataEmail, Props> {
  loadSuggestionsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/email';

  getLoadSuggestionsData = (): Record<string, unknown> => {
    const { count } = this.props;
    const { query } = this.state;

    return {
      query,
      count: count || 10,
    };
  };

  protected getSuggestionKey = (suggestion: DaDataSuggestion<DaDataEmail>): string => suggestion.value;

  protected renderOption = (suggestion: DaDataSuggestion<DaDataEmail>): ReactNode => {
    const { renderOption, highlightClassName } = this.props;
    const { query } = this.state;

    return renderOption ? (
      renderOption(suggestion, query)
    ) : (
      <div>
        <HighlightWords
          highlightClassName={highlightClassName || 'react-dadata--highlighted'}
          words={this.getHighlightWords()}
          text={suggestion.value}
        />
      </div>
    );
  };
}
