"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSuggestions = void 0;
var react_1 = __importDefault(require("react"));
var BaseSuggestions = /** @class */ (function (_super) {
    __extends(BaseSuggestions, _super);
    function BaseSuggestions(props) {
        var _this = _super.call(this, props) || this;
        /**
         * URL для загрузки подсказок, переопределяется в конкретном компоненте
         */
        _this.loadSuggestionsUrl = '';
        _this.handleInputFocus = function (event) {
            _this.setState({ isFocused: true });
            var suggestions = _this.state.suggestions;
            if (suggestions.length === 0) {
                _this.fetchSuggestions();
            }
            var inputProps = _this.props.inputProps;
            if (inputProps && inputProps.onFocus) {
                inputProps.onFocus(event);
            }
        };
        _this.handleInputBlur = function (event) {
            var suggestions = _this.state.suggestions;
            _this.setState({ isFocused: false });
            if (suggestions.length === 0) {
                _this.fetchSuggestions();
            }
            var inputProps = _this.props.inputProps;
            if (inputProps && inputProps.onBlur) {
                inputProps.onBlur(event);
            }
        };
        _this.handleInputChange = function (event) {
            var value = event.target.value;
            _this.setState({ query: value, inputQuery: value }, function () {
                _this.fetchSuggestions();
            });
        };
        _this.handleInputKeyPress = function (event) {
            var _a = _this.state, suggestions = _a.suggestions, suggestionIndex = _a.suggestionIndex, inputQuery = _a.inputQuery;
            if (event.which === 40) {
                // Arrow down
                event.preventDefault();
                if (suggestionIndex < suggestions.length) {
                    var newSuggestionIndex = suggestionIndex + 1;
                    var newInputQuery = suggestions[newSuggestionIndex].value;
                    _this.setState({ suggestionIndex: newSuggestionIndex, query: newInputQuery });
                }
            }
            else if (event.which === 38) {
                // Arrow up
                event.preventDefault();
                if (suggestionIndex >= 0) {
                    var newSuggestionIndex = suggestionIndex - 1;
                    var newInputQuery = newSuggestionIndex === -1 ? inputQuery : suggestions[newSuggestionIndex].value;
                    _this.setState({ suggestionIndex: newSuggestionIndex, query: newInputQuery });
                }
            }
            else if (event.which === 13) {
                // Enter
                event.preventDefault();
                if (suggestionIndex >= 0) {
                    _this.selectSuggestion(suggestionIndex);
                }
            }
        };
        /**
         * Функция, которая вернет данные для отправки для получения подсказок
         */
        _this.getLoadSuggestionsData = function () { return ({}); };
        _this.fetchSuggestions = function () {
            var token = _this.props.token;
            if (_this.xhr) {
                _this.xhr.abort();
            }
            _this.xhr = new XMLHttpRequest();
            _this.xhr.open('POST', _this.loadSuggestionsUrl);
            _this.xhr.setRequestHeader('Accept', 'application/json');
            _this.xhr.setRequestHeader('Authorization', "Token " + token);
            _this.xhr.setRequestHeader('Content-Type', 'application/json');
            _this.xhr.send(JSON.stringify(_this.getLoadSuggestionsData()));
            _this.xhr.onreadystatechange = function () {
                if (!_this.xhr || _this.xhr.readyState !== 4) {
                    return;
                }
                if (_this.xhr.status === 200) {
                    var responseJson = JSON.parse(_this.xhr.response);
                    if (responseJson && responseJson.suggestions) {
                        _this.setState({ suggestions: responseJson.suggestions, suggestionIndex: -1 });
                    }
                }
            };
        };
        _this.onSuggestionClick = function (index, event) {
            event.stopPropagation();
            _this.selectSuggestion(index);
        };
        _this.selectSuggestion = function (index) {
            var suggestions = _this.state.suggestions;
            var onChange = _this.props.onChange;
            if (suggestions.length >= index - 1) {
                var suggestion = suggestions[index];
                _this.setState({ query: suggestion.value, inputQuery: suggestion.value }, function () {
                    _this.fetchSuggestions();
                    setTimeout(function () { return _this.setCursorToEnd(_this.textInput); }, 100);
                });
                if (onChange) {
                    onChange(suggestion);
                }
            }
        };
        _this.setCursorToEnd = function (element) {
            if (element) {
                var valueLength = element.value.length;
                if (element.selectionStart || element.selectionStart === 0) {
                    // eslint-disable-next-line no-param-reassign
                    element.selectionStart = valueLength;
                    // eslint-disable-next-line no-param-reassign
                    element.selectionEnd = valueLength;
                    element.focus();
                }
            }
        };
        _this.getHighlightWords = function () {
            var inputQuery = _this.state.inputQuery;
            var wordsToPass = ['г', 'респ', 'ул', 'р-н', 'село', 'деревня', 'поселок', 'пр-д', 'пл', 'к', 'кв', 'обл', 'д'];
            var words = inputQuery.replace(',', '').split(' ');
            words = words.filter(function (word) {
                return wordsToPass.indexOf(word) < 0;
            });
            return words;
        };
        _this.renderOption = function (suggestion) {
            return null;
        };
        var defaultQuery = _this.props.defaultQuery;
        _this.state = {
            query: defaultQuery || '',
            inputQuery: defaultQuery || '',
            isFocused: false,
            suggestions: [],
            suggestionIndex: -1,
        };
        return _this;
    }
    BaseSuggestions.prototype.render = function () {
        var _this = this;
        var _a = this.props, inputProps = _a.inputProps, hintText = _a.hintText, containerClassName = _a.containerClassName, hintClassName = _a.hintClassName, optionClassName = _a.optionClassName, currentOptionClassName = _a.currentOptionClassName, children = _a.children;
        var _b = this.state, query = _b.query, isFocused = _b.isFocused, suggestions = _b.suggestions, suggestionIndex = _b.suggestionIndex;
        return (react_1.default.createElement("div", { className: containerClassName || 'react-dadata react-dadata__container' },
            react_1.default.createElement("div", null,
                react_1.default.createElement("input", __assign({ autoComplete: "off", className: "react-dadata__input" }, inputProps, { value: query, ref: function (input) {
                        _this.textInput = input;
                    }, onChange: this.handleInputChange, onKeyPress: this.handleInputKeyPress, onKeyDown: this.handleInputKeyPress, onFocus: this.handleInputFocus, onBlur: this.handleInputBlur }))),
            isFocused && suggestions && suggestions.length > 0 && (react_1.default.createElement("div", { className: "react-dadata__suggestions" },
                typeof hintText !== 'undefined' && (react_1.default.createElement("div", { className: hintClassName || 'react-dadata__suggestion-note' }, hintText)),
                suggestions.map(function (suggestion, index) {
                    var suggestionClass = optionClassName || 'react-dadata__suggestion';
                    if (index === suggestionIndex) {
                        suggestionClass += " " + (currentOptionClassName || 'react-dadata__suggestion--current');
                    }
                    return (react_1.default.createElement("button", { key: suggestion.value, onMouseDown: _this.onSuggestionClick.bind(_this, index), className: suggestionClass }, _this.renderOption(suggestion)));
                }))),
            children));
    };
    return BaseSuggestions;
}(react_1.default.PureComponent));
exports.BaseSuggestions = BaseSuggestions;
