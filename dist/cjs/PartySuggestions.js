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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartySuggestions = void 0;
var react_highlight_words_1 = __importDefault(require("react-highlight-words"));
var react_1 = __importDefault(require("react"));
var BaseSuggestions_1 = require("./BaseSuggestions");
var PartySuggestions = /** @class */ (function (_super) {
    __extends(PartySuggestions, _super);
    function PartySuggestions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loadSuggestionsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party';
        _this.getLoadSuggestionsData = function () {
            var _a = _this.props, count = _a.count, filterStatus = _a.filterStatus, filterType = _a.filterType, filterLocations = _a.filterLocations, filterLocationsBoost = _a.filterLocationsBoost;
            var query = _this.state.query;
            var requestPayload = {
                query: query,
                count: count || 10,
            };
            // Ограничение по статусу организации
            if (filterStatus) {
                requestPayload.status = filterStatus;
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
        _this.getSuggestionKey = function (suggestion) { return "" + suggestion.data.inn; };
        _this.renderOption = function (suggestion) {
            var _a = _this.props, renderOption = _a.renderOption, highlightClassName = _a.highlightClassName;
            return renderOption ? (renderOption(suggestion)) : (react_1.default.createElement("div", null,
                react_1.default.createElement("div", { className: suggestion.data.state.status === 'LIQUIDATED' ? 'react-dadata__suggestion--line-through' : undefined },
                    react_1.default.createElement(react_highlight_words_1.default, { highlightClassName: highlightClassName || 'react-dadata--highlighted', autoEscape: true, searchWords: _this.getHighlightWords(), textToHighlight: suggestion.value })),
                react_1.default.createElement("div", { className: "react-dadata__suggestion-subtitle" },
                    suggestion.data.inn && react_1.default.createElement("div", { className: "react-dadata__suggestion-subtitle-item" }, suggestion.data.inn),
                    suggestion.data.address && suggestion.data.address.value && (react_1.default.createElement("div", { className: "react-dadata__suggestion-subtitle-item" },
                        react_1.default.createElement(react_highlight_words_1.default, { highlightClassName: highlightClassName || 'react-dadata--highlighted', autoEscape: true, searchWords: _this.getHighlightWords(), textToHighlight: suggestion.data.address.value }))))));
        };
        return _this;
    }
    return PartySuggestions;
}(BaseSuggestions_1.BaseSuggestions));
exports.PartySuggestions = PartySuggestions;
