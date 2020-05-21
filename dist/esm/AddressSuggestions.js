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
import Highlighter from 'react-highlight-words';
import React from 'react';
import { BaseSuggestions } from './BaseSuggestions';
var AddressSuggestions = /** @class */ (function (_super) {
    __extends(AddressSuggestions, _super);
    function AddressSuggestions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loadSuggestionsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
        _this.getLoadSuggestionsData = function () {
            var _a = _this.props, count = _a.count, filterFromBound = _a.filterFromBound, filterToBound = _a.filterToBound, filterLocations = _a.filterLocations, filterLocationsBoost = _a.filterLocationsBoost;
            var query = _this.state.query;
            var requestPayload = {
                query: query,
                count: count || 10,
            };
            // Ограничение поиска по типу
            if (filterFromBound && filterToBound) {
                requestPayload.from_bound = { value: filterFromBound };
                requestPayload.to_bound = { value: filterToBound };
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
        _this.renderOption = function (suggestion) {
            var _a = _this.props, renderOption = _a.renderOption, highlightClassName = _a.highlightClassName;
            return renderOption ? renderOption(suggestion) : (React.createElement(Highlighter, { highlightClassName: highlightClassName || 'react-dadata--highlighted', autoEscape: true, searchWords: _this.getHighlightWords(), textToHighlight: suggestion.value }));
        };
        return _this;
    }
    return AddressSuggestions;
}(BaseSuggestions));
export { AddressSuggestions };
