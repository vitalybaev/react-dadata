import * as React from 'react';
import * as Highlighter from 'react-highlight-words';
import './react-dadata.css';

export namespace ReactDadata {
  export type DadataSuggestion = {
    value: string
    unrestricted_value: string
    data: DadataAddress
  }

  export type DadataAddress = {
    city: string
    city_area: string
    city_district: string
  }

  export interface Props  {
    token: string
    placeholder?: string
    query?: string
    onChange?: (suggestion: DadataSuggestion) => void
  }

  export interface State {
    query: string
    inputQuery: string
    inputFocused: boolean
    suggestions: Array<DadataSuggestion>
    suggestionIndex: number
    suggestionsVisible: boolean
  }
}

export class ReactDadata extends React.Component<ReactDadata.Props, ReactDadata.State> {

  protected textInput: HTMLInputElement;

  protected xhr: XMLHttpRequest;

  constructor(props: ReactDadata.Props) {
    super(props);

    this.state = {
      query: this.props.query ? this.props.query : '',
      inputQuery: this.props.query ? this.props.query : '',
      inputFocused: false,
      suggestions: [],
      suggestionIndex: -1,
      suggestionsVisible: true
    }
  }

  onInputFocus = () => {
    this.setState({inputFocused: true});
    if (this.state.suggestions.length == 0) {
      this.fetchSuggestions();
    }
  };

  onInputBlur = () => {
    this.setState({inputFocused: false});
    if (this.state.suggestions.length == 0) {
      this.fetchSuggestions();
    }
  };

  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState({query: value, inputQuery: value, suggestionsVisible: true}, () => this.fetchSuggestions());
  };

  onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.which == 40) {
      // Arrow down
      event.preventDefault();
      if (this.state.suggestionIndex < this.state.suggestions.length) {
        const newSuggestionIndex = this.state.suggestionIndex + 1;
        const newInputQuery = this.state.suggestions[newSuggestionIndex].value;
        this.setState({suggestionIndex: newSuggestionIndex, query: newInputQuery})
      }
    } else if (event.which == 38) {
      // Arrow up
      event.preventDefault();
      if (this.state.suggestionIndex >= 0) {
        const newSuggestionIndex = this.state.suggestionIndex - 1;
        const newInputQuery = newSuggestionIndex == -1 ? this.state.inputQuery : this.state.suggestions[newSuggestionIndex].value;
        this.setState({suggestionIndex: newSuggestionIndex, query: newInputQuery})
      }
    } else if (event.which == 13) {
      // Enter
      event.preventDefault();
      if (this.state.suggestionIndex >= 0) {
        this.selectSuggestion(this.state.suggestionIndex);
      }
    }
  };

  fetchSuggestions = () => {
    if (this.xhr) {
      this.xhr.abort();
    }
    this.xhr = new XMLHttpRequest();
    this.xhr.open("POST", "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address?5");
    this.xhr.setRequestHeader("Accept", "application/json");
    this.xhr.setRequestHeader("Authorization", `Token ${this.props.token}`);
    this.xhr.setRequestHeader("Content-Type", "application/json");
    this.xhr.send(JSON.stringify({
      query: this.state.query,
      count: 10
    }));

    this.xhr.onreadystatechange = () => {
      if (this.xhr.readyState != 4) {
        return;
      }

      if (this.xhr.status == 200) {
        const responseJson = JSON.parse(this.xhr.response);
        if (responseJson && responseJson.suggestions) {
          this.setState({suggestions: responseJson.suggestions, suggestionIndex: -1});
        }
      }
    };
  };

  onSuggestionClick = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    this.selectSuggestion(index);
  };

  selectSuggestion = (index: number) => {
    if (this.state.suggestions.length >= index - 1) {
      this.setState({query: this.state.suggestions[index].value, suggestionsVisible: false, inputQuery: this.state.suggestions[index].value}, () => {
        this.fetchSuggestions();
        setTimeout(() => this.setCursorToEnd(this.textInput), 100);
      });

      if (this.props.onChange) {
        this.props.onChange(this.state.suggestions[index]);
      }
    }
  };

  setCursorToEnd = (ele) => {
    const valueLength = ele.value.length;
    if (ele.selectionStart || ele.selectionStart == '0') {
      // Firefox/Chrome
      ele.selectionStart = valueLength;
      ele.selectionEnd = valueLength;
      ele.focus();
    }
  };

  getHighlightWords = (): Array<string> => {
    const wordsToPass = ['г', 'респ', 'ул', 'р-н', 'село', 'деревня', 'поселок', 'пр-д', 'пл', 'к', 'кв', 'обл', 'д'];
    let words = this.state.inputQuery.replace(',', '').split(' ');
    words = words.filter((word) => {
      return wordsToPass.indexOf(word) < 0;
    });
    return words;
  };

  render() {
    return (
      <div className="react-dadata react-dadata__container">
        <div>
          <input className="react-dadata__input"
                 placeholder={this.props.placeholder ? this.props.placeholder : ''}
                 value={this.state.query}
                 ref={ (input) => { this.textInput = input as HTMLInputElement; } }
                 onChange={this.onInputChange}
                 onKeyPress={this.onKeyPress}
                 onKeyDown={this.onKeyPress}
                 onFocus={this.onInputFocus}
                 onBlur={this.onInputBlur}
          />
        </div>
        {this.state.inputFocused && this.state.suggestionsVisible && this.state.suggestions && this.state.suggestions.length > 0 && <div className="react-dadata__suggestions">
          <div className="react-dadata__suggestion-note">Выберите вариант или продолжите ввод</div>
          {this.state.suggestions.map((suggestion, index) => {
            let suggestionClass = 'react-dadata__suggestion';
            if (index == this.state.suggestionIndex) {
              suggestionClass += ' react-dadata__suggestion--current';
            }
            return <div key={suggestion.value} onMouseDown={this.onSuggestionClick.bind(this, index)} className={suggestionClass}><Highlighter highlightClassName="react-dadata--highlighted" searchWords={this.getHighlightWords()} textToHighlight={suggestion.value}/></div>
          })}
        </div>}
      </div>
    );
  }
}
