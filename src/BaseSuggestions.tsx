import React, { ChangeEvent, MouseEvent, FocusEvent, ReactNode } from 'react';
import { CommonProps, DaDataSuggestion } from './types';
import { makeRequest } from './request';

export type BaseProps<SuggestionType> = CommonProps<SuggestionType>;

export interface BaseState<SuggestionType> {
  /**
   * Текущая строка в поле ввода
   */
  query: string;

  displaySuggestions: boolean;

  /**
   * Оригинальная строка в поле поиска, требуется для хранения значения в момент переключения подсказок стрелками
   */
  inputQuery: string;

  /**
   * Находится ли сейчас фокус в поле ввода
   */
  isFocused: boolean;

  /**
   * Массив с текущими подсказками
   */
  suggestions: Array<DaDataSuggestion<SuggestionType>>;

  /**
   * Индекс текущей выбранной подсказки
   */
  suggestionIndex: number;
}

export class BaseSuggestions<SuggestionType, OwnProps> extends React.PureComponent<
  BaseProps<SuggestionType> & OwnProps,
  BaseState<SuggestionType>
> {
  /**
   * URL для загрузки подсказок, переопределяется в конкретном компоненте
   */
  protected loadSuggestionsUrl = '';

  /**
   * HTML-input
   */
  private textInput?: HTMLInputElement;

  constructor(props: BaseProps<SuggestionType> & OwnProps) {
    super(props);

    const { defaultQuery } = this.props;

    this.state = {
      query: (defaultQuery as string | undefined) || '',
      inputQuery: (defaultQuery as string | undefined) || '',
      isFocused: false,
      displaySuggestions: true,
      suggestions: [],
      suggestionIndex: -1,
    };
  }

  private handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
    this.setState({ isFocused: true });

    const { suggestions } = this.state;

    if (suggestions.length === 0) {
      this.fetchSuggestions();
    }

    const { inputProps } = this.props;
    if (inputProps && inputProps.onFocus) {
      inputProps.onFocus(event);
    }
  };

  private handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    const { suggestions } = this.state;

    this.setState({ isFocused: false });
    if (suggestions.length === 0) {
      this.fetchSuggestions();
    }

    const { inputProps } = this.props;
    if (inputProps && inputProps.onBlur) {
      inputProps.onBlur(event);
    }
  };

  private handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const { inputProps } = this.props;
    this.setState({ query: value, inputQuery: value, displaySuggestions: true }, () => {
      this.fetchSuggestions();
    });

    if (inputProps && inputProps.onChange) {
      inputProps.onChange(event);
    }
  };

  private handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { suggestions, suggestionIndex, inputQuery } = this.state;
    if (event.which === 40) {
      // Arrow down
      event.preventDefault();
      if (suggestionIndex < suggestions.length) {
        const newSuggestionIndex = suggestionIndex + 1;
        const newInputQuery = suggestions[newSuggestionIndex].value;
        this.setState({ suggestionIndex: newSuggestionIndex, query: newInputQuery });
      }
    } else if (event.which === 38) {
      // Arrow up
      event.preventDefault();
      if (suggestionIndex >= 0) {
        const newSuggestionIndex = suggestionIndex - 1;
        const newInputQuery = newSuggestionIndex === -1 ? inputQuery : suggestions[newSuggestionIndex].value;
        this.setState({ suggestionIndex: newSuggestionIndex, query: newInputQuery });
      }
    } else if (event.which === 13) {
      // Enter
      event.preventDefault();
      if (suggestionIndex >= 0) {
        this.selectSuggestion(suggestionIndex);
      }
    }
  };

  /**
   * Функция, которая вернет данные для отправки для получения подсказок
   */
  protected getLoadSuggestionsData = (): any => ({});

  private fetchSuggestions = () => {
    const { token } = this.props;

    makeRequest('POST', this.loadSuggestionsUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      json: this.getLoadSuggestionsData(),
    }, (suggestions) => {
      this.setState({ suggestions, suggestionIndex: -1 });
    });
  };

  private onSuggestionClick = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    this.selectSuggestion(index);
  };

  private selectSuggestion = (index: number) => {
    const { suggestions } = this.state;
    const { onChange } = this.props;

    if (suggestions.length >= index - 1) {
      const suggestion = suggestions[index];
      this.setState({ query: suggestion.value, inputQuery: suggestion.value, displaySuggestions: false }, () => {
        this.fetchSuggestions();
        setTimeout(() => this.setCursorToEnd(this.textInput));
      });

      if (onChange) {
        onChange(suggestion);
      }
    }
  };

  private setCursorToEnd = (element: HTMLInputElement | undefined) => {
    if (element) {
      const valueLength = element.value.length;
      if (element.selectionStart || element.selectionStart === 0) {
        // eslint-disable-next-line no-param-reassign
        element.selectionStart = valueLength;
        // eslint-disable-next-line no-param-reassign
        element.selectionEnd = valueLength;
        element.focus();
      }
    }
  };

  protected getHighlightWords = (): string[] => {
    const { inputQuery } = this.state;
    const wordsToPass = ['г', 'респ', 'ул', 'р-н', 'село', 'деревня', 'поселок', 'пр-д', 'пл', 'к', 'кв', 'обл', 'д'];
    let words = inputQuery.replace(',', '').split(' ');
    words = words.filter((word) => {
      return wordsToPass.indexOf(word) < 0;
    });
    return words;
  };

  protected renderOption = (suggestion: DaDataSuggestion<SuggestionType>): ReactNode => {
    return null;
  };

  /**
   * Функция, которая вернет уникальный key для списка React
   * @param suggestion
   */
  protected getSuggestionKey = (suggestion: DaDataSuggestion<SuggestionType>): string => suggestion.value;

  public render() {
    const {
      inputProps,
      hintText,
      containerClassName,
      hintClassName,
      suggestionsClassName,
      suggestionClassName,
      currentSuggestionClassName,
      children,
    } = this.props;
    const { query, isFocused, suggestions, suggestionIndex, displaySuggestions } = this.state;

    return (
      <div className={containerClassName || 'react-dadata react-dadata__container'}>
        <div>
          <input
            autoComplete="off"
            className="react-dadata__input"
            {...inputProps}
            value={query}
            ref={(input) => {
              this.textInput = input as HTMLInputElement;
            }}
            onChange={this.handleInputChange}
            onKeyPress={this.handleInputKeyPress}
            onKeyDown={this.handleInputKeyPress}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
          />
        </div>
        {isFocused && suggestions && displaySuggestions && suggestions.length > 0 && (
          <div className={suggestionsClassName || 'react-dadata__suggestions'}>
            {typeof hintText !== 'undefined' && (
              <div className={hintClassName || 'react-dadata__suggestion-note'}>{hintText}</div>
            )}
            {suggestions.map((suggestion, index) => {
              let suggestionClass = suggestionClassName || 'react-dadata__suggestion';
              if (index === suggestionIndex) {
                suggestionClass += ` ${currentSuggestionClassName || 'react-dadata__suggestion--current'}`;
              }
              return (
                <button
                  key={this.getSuggestionKey(suggestion)}
                  onMouseDown={this.onSuggestionClick.bind(this, index)}
                  className={suggestionClass}
                >
                  {this.renderOption(suggestion)}
                </button>
              );
            })}
          </div>
        )}
        {children}
      </div>
    );
  }
}
