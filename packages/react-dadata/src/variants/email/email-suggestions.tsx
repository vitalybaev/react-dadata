import React, { type ReactNode } from 'react';
import { type BaseProps, BaseSuggestions } from '../../base-suggestions';
import { HighlightWords } from '../../highlight-words';
import type { DaDataEmail, DaDataEmailSuggestion } from './email-types';

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

  protected getSuggestionKey = (suggestion: DaDataEmailSuggestion): string => suggestion.value;

  protected renderOption = (suggestion: DaDataEmailSuggestion): ReactNode => {
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
