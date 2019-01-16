import * as React from 'react';
import * as Highlighter from 'react-highlight-words';
import './react-dadata.css';

declare module 'react' {
     interface InputHTMLAttributes<T> {
        validate?: (value: string) => void
    }
}
export namespace ReactDadata {
  export type DadataSuggestion = {
    value: string
    unrestricted_value: string
    data: DadataAddress
  }

  export type DadataAddress = {
    area: string
    area_fias_id: string
    area_kladr_id: string
    area_type: string
    area_type_full: string
    area_with_type: string
    beltway_distance: null
    beltway_hit: null
    block: string
    block_type: string
    block_type_full: string
    capital_marker: "0" | "1" | "2" | "3" | "4"
    city: string
    city_area: string
    city_district: string
    city_district_fias_id: string
    city_district_kladr_id: string
    city_district_type: string
    city_district_type_full: string
    city_district_with_type: string
    city_fias_id: string
    city_kladr_id: string
    city_type: string
    city_type_full: string
    city_with_type: string
    country: string
    fias_id: string
    fias_level: string
    flat: string
    flat_area: null
    flat_price: null
    flat_type: string
    flat_type_full: string
    geo_lat: string
    geo_lon: string
    history_values: string
    house: string
    house_fias_id: string
    house_kladr_id: string
    house_type: string
    house_type_full: string
    kladr_id: string
    okato: string
    oktmo: string
    postal_box: string
    postal_code: string
    qc: null
    qc_complete: null
    qc_geo: "0" | "1" | "2" | "3" | "4" | "5"
    qc_house: null
    region: string
    region_fias_id: string
    region_kladr_id: string
    region_type: string
    region_type_full: string
    region_with_type: string
    settlement: string
    settlement_fias_id: string
    settlement_kladr_id: string
    settlement_type: string
    settlement_type_full: string
    settlement_with_type: string
    source: string
    square_meter_price: null
    street: string
    street_fias_id: string
    street_kladr_id: string
    street_type: string
    street_type_full: string
    street_with_type: string
    tax_office: string
    tax_office_legal: string
    timezone: null
    unparsed_parts: null
  }

  export type BoundsType = 'region' | 'area' | 'city' | 'settlement' | 'street' | 'house'

  export interface Props  {
    token: string
    placeholder?: string
    query?: string
    autoload?: boolean
    count?: number
    onChange?: (suggestion: DadataSuggestion) => void
    autocomplete?: string
    validate?: (value: string) => void
    className?: string
    disabled?: boolean
    fromBound?: BoundsType
    toBound?: BoundsType
    address?: DadataSuggestion
  }

  export interface State {
    query: string
    inputQuery: string
    inputFocused: boolean
    suggestions: Array<DadataSuggestion>
    suggestionIndex: number
    suggestionsVisible: boolean
    isValid:boolean
  }
}

export class ReactDadata extends React.PureComponent<ReactDadata.Props, ReactDadata.State> {

  /**
   * HTML-input
   */
  protected textInput?: HTMLInputElement;

  /**
   * XMLHttpRequest instance
   */
  protected xhr?: XMLHttpRequest;

  constructor(props: ReactDadata.Props) {
    super(props);

    this.state = {
      query: this.props.query ? this.props.query : '',
      inputQuery: this.props.query ? this.props.query : '',
      inputFocused: false,
      suggestions: [],
      suggestionIndex: -1,
      suggestionsVisible: true,
      isValid: false
    }
  }

  componentDidMount() {
    if (this.props.autoload && this.state.query) {
      this.fetchSuggestions();
    }
  };

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
    this.setState({query: value, inputQuery: value, suggestionsVisible: true}, () => {
      if (this.props.validate){
        this.props.validate(value);
      }
      this.fetchSuggestions();
    });
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
    let requestPayload: any = {
      query: this.state.query,
      count: this.props.count ? this.props.count : 10,
    };
    // Checking for granular suggestions
    if (this.props.fromBound && this.props.toBound) {
      // When using granular suggestion, all dadata components have to receive address property that contains shared address info.
      if (!this.props.address) {
        throw new Error("You have to pass address property with DaData address object to connect separate components");
      }
      requestPayload.from_bound = {value: this.props.fromBound};
      requestPayload.to_bound = {value: this.props.toBound};
      requestPayload.restrict_value = true;

      if (this.props.address.data) {
        // Define location limitation
        let location: any = {};
        if (this.props.address.data.region_fias_id) {
          location.region_fias_id = this.props.address.data.region_fias_id;
        }
        if (this.props.address.data.city_fias_id) {
          location.city_fias_id = this.props.address.data.city_fias_id;
        }
        if (this.props.address.data.settlement_fias_id) {
          location.settlement_fias_id = this.props.address.data.settlement_fias_id;
        }
        if (this.props.address.data.street_fias_id) {
          location.street_fias_id = this.props.address.data.street_fias_id;
        }
        requestPayload.locations = [location];
      }
    }
    this.xhr.send(JSON.stringify(requestPayload));

    this.xhr.onreadystatechange = () => {
      if (!this.xhr || this.xhr.readyState != 4) {
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

  setCursorToEnd = (element) => {
    const valueLength = element.value.length;
    if (element.selectionStart || element.selectionStart == '0') {
      // Firefox/Chrome
      element.selectionStart = valueLength;
      element.selectionEnd = valueLength;
      element.focus();
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
    let classNames = ['react-dadata__input'];
    if (this.props.className) {
      classNames.push(this.props.className)
    }

    return (
      <div className="react-dadata react-dadata__container">
        <div>
          <input className={classNames.join(' ')}
                 disabled={this.props.disabled}
                 placeholder={this.props.placeholder ? this.props.placeholder : ''}
                 value={this.state.query}
                 ref={ (input) => { this.textInput = input as HTMLInputElement; } }
                 onChange={this.onInputChange}
                 onKeyPress={this.onKeyPress}
                 onKeyDown={this.onKeyPress}
                 onFocus={this.onInputFocus}
                 onBlur={this.onInputBlur}
                 validate={this.props.validate}
                 autoComplete={this.props.autocomplete ? this.props.autocomplete : 'off'}
          />
        </div>
        {this.state.inputFocused && this.state.suggestionsVisible && this.state.suggestions && this.state.suggestions.length > 0 && <div className="react-dadata__suggestions">
          <div className="react-dadata__suggestion-note">Выберите вариант или продолжите ввод</div>
          {this.state.suggestions.map((suggestion, index) => {
            let suggestionClass = 'react-dadata__suggestion';
            if (index == this.state.suggestionIndex) {
              suggestionClass += ' react-dadata__suggestion--current';
            }
            return <div key={suggestion.value} onMouseDown={this.onSuggestionClick.bind(this, index)} className={suggestionClass}><Highlighter highlightClassName="react-dadata--highlighted" autoEscape={true} searchWords={this.getHighlightWords()} textToHighlight={suggestion.value}/></div>
          })}
        </div>}
      </div>
    );
  }
}
