import React from 'react';
import { CommonProps, DaDataSuggestion } from './types';
declare type Props<SuggestionType> = CommonProps<SuggestionType>;
interface State<SuggestionType> {
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
export declare class BaseSuggestions<SuggestionType> extends React.PureComponent<Props<SuggestionType>, State<SuggestionType>> {
    /**
     * URL для загрузки подсказок, переопределяется в конкретном компоненте
     */
    protected loadSuggestionsUrl: string;
    /**
     * HTML-input
     */
    private textInput?;
    /**
     * XMLHttpRequest instance
     */
    private xhr?;
    constructor(props: Props<SuggestionType>);
    private handleInputFocus;
    private handleInputBlur;
    private handleInputChange;
    onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    /**
     * Функция, которая вернет данные для отправки для получения подсказок
     */
    protected getLoadSuggestionsData: () => {};
    private fetchSuggestions;
    private onSuggestionClick;
    private selectSuggestion;
    private setCursorToEnd;
    private getHighlightWords;
    render(): JSX.Element;
}
export {};
