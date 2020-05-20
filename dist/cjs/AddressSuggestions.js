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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressSuggestions = void 0;
var BaseSuggestions_1 = require("./BaseSuggestions");
var AddressSuggestions = /** @class */ (function (_super) {
    __extends(AddressSuggestions, _super);
    function AddressSuggestions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loadSuggestionsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
        _this.getLoadSuggestionsData = function () {
            var requestPayload = {
                query: _this.state.query,
                count: _this.props.count ? _this.props.count : 10,
            };
            return requestPayload;
        };
        return _this;
    }
    return AddressSuggestions;
}(BaseSuggestions_1.BaseSuggestions));
exports.AddressSuggestions = AddressSuggestions;
