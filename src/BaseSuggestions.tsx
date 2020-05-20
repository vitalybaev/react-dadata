import React, { ChangeEvent, MouseEvent, FocusEvent } from 'react';
import Highlighter from 'react-highlight-words';
import { CommonProps, DaDataSuggestion } from './types';

export type BaseProps<SuggestionType> = CommonProps<SuggestionType>;

export interface BaseState<SuggestionType> {
  /**
   * Текущая строка в поле ввода
   */
  query: string;

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

export class BaseSuggestions<SuggestionType> extends React.PureComponent<BaseProps<SuggestionType>, BaseState<SuggestionType>> {
  /**
   * URL для загрузки подсказок, переопределяется в конкретном компоненте
   */
  protected loadSuggestionsUrl = '';

  /**
   * HTML-input
   */
  private textInput?: HTMLInputElement;

  /**
   * XMLHttpRequest instance
   */
  private xhr?: XMLHttpRequest;

  constructor(props: BaseProps<SuggestionType>) {
    super(props);

    const { defaultQuery } = this.props;

    this.state = {
      query: defaultQuery || '',
      inputQuery: defaultQuery || '',
      isFocused: false,
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
    this.setState({ query: value, inputQuery: value }, () => {
      this.fetchSuggestions();
    });
  };

  onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { suggestions, suggestionIndex, inputQuery } = this.state;
    if (event.which === 40) {
      // Arrow down
      event.preventDefault();
      if (suggestionIndex < suggestions.length) {
        const newSuggestionIndex = suggestionIndex + 1;
        const newInputQuery = suggestions[newSuggestionIndex].value;
        this.setState({suggestionIndex: newSuggestionIndex, query: newInputQuery})
      }
    } else if (event.which === 38) {
      // Arrow up
      event.preventDefault();
      if (suggestionIndex >= 0) {
        const newSuggestionIndex = suggestionIndex - 1;
        const newInputQuery = newSuggestionIndex === -1 ? inputQuery : suggestions[newSuggestionIndex].value;
        this.setState({ suggestionIndex: newSuggestionIndex, query: newInputQuery })
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
  protected getLoadSuggestionsData = (): any => ({})

  private fetchSuggestions = () => {
    const { token } = this.props;

    if (this.xhr) {
      this.xhr.abort();
    }
    this.xhr = new XMLHttpRequest();
    this.xhr.open("POST", this.loadSuggestionsUrl);
    this.xhr.setRequestHeader("Accept", "application/json");
    this.xhr.setRequestHeader("Authorization", `Token ${token}`);
    this.xhr.setRequestHeader("Content-Type", "application/json");
    this.xhr.send(JSON.stringify(this.getLoadSuggestionsData()));

    this.xhr.onreadystatechange = () => {
      if (!this.xhr || this.xhr.readyState !== 4) {
        return;
      }

      if (this.xhr.status === 200) {
        const responseJson = JSON.parse(this.xhr.response);
        if (responseJson && responseJson.suggestions) {
          this.setState({suggestions: responseJson.suggestions, suggestionIndex: -1});
        }
      }
    };
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
      this.setState({ query: suggestion.value, inputQuery: suggestion.value }, () => {
        this.fetchSuggestions();
        setTimeout(() => this.setCursorToEnd(this.textInput), 100);
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

  private getHighlightWords = (): string[] => {
    const { inputQuery } = this.state;
    const wordsToPass = ['г', 'респ', 'ул', 'р-н', 'село', 'деревня', 'поселок', 'пр-д', 'пл', 'к', 'кв', 'обл', 'д'];
    let words = inputQuery.replace(',', '').split(' ');
    words = words.filter((word) => {
      return wordsToPass.indexOf(word) < 0;
    });
    return words;
  };

  public render() {
    const { inputProps } = this.props;
    const { query, isFocused, suggestions, suggestionIndex } = this.state;

    return (
      <div className="react-dadata react-dadata__container">
        <div>
          <input
            autoComplete="off"
            className="react-dadata__input"
            {...inputProps}
            value={query}
            ref={ (input) => { this.textInput = input as HTMLInputElement; } }
            onChange={this.handleInputChange}
            onKeyPress={this.onKeyPress}
            onKeyDown={this.onKeyPress}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
          />
        </div>
        {isFocused && suggestions && suggestions.length > 0 && (
          <div className="react-dadata__suggestions">
            <div className="react-dadata__suggestion-note">Выберите вариант или продолжите ввод</div>
            {suggestions.map((suggestion, index) => {
              let suggestionClass = 'react-dadata__suggestion';
              if (index === suggestionIndex) {
                suggestionClass += ' react-dadata__suggestion--current';
              }
              return (
                <button
                  key={suggestion.value}
                  onMouseDown={this.onSuggestionClick.bind(this, index)}
                  className={suggestionClass}
                >
                  <Highlighter
                    highlightClassName="react-dadata--highlighted"
                    autoEscape
                    searchWords={this.getHighlightWords()}
                    textToHighlight={suggestion.value}
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>
    );
  }
}
