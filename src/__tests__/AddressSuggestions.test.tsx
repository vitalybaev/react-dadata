import React, { FC, HTMLProps, ReactNode } from 'react';
import { mount } from 'enzyme';
import { AddressSuggestions } from '../AddressSuggestions';
import { createAddressMock, addressMockKrasnodar, requestCalls } from './mocks';
import 'jest-enzyme';
import * as requestModule from '../request';
import { DaDataSuggestion, DaDataAddress } from '../types';

let makeRequestMock: jest.SpyInstance;

beforeEach(() => {
  requestCalls.length = 0;

  makeRequestMock = jest.spyOn(requestModule, 'makeRequest');
  makeRequestMock.mockImplementation(createAddressMock());
});

afterEach(() => {
  makeRequestMock.mockReset();
});

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe('AddressSuggestions', () => {
  it('is truthy', () => {
    expect(AddressSuggestions).toBeTruthy();
  });

  it('AddressSuggestions renders correctly', () => {
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" />);
    expect(wrapper.find('div.react-dadata.react-dadata__container')).toExist();
    expect(wrapper.find('input.react-dadata__input')).toExist();
    expect(wrapper.find('ul.react-dadata__suggestions')).not.toExist();
  });

  it('input renders correctly with props', () => {
    const inputProps: HTMLProps<HTMLInputElement> = {
      autoComplete: 'tel',
      'aria-label': 'Test aria label',
      className: 'input-class-name',
    };
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" inputProps={inputProps} />);
    expect(wrapper.find('div.react-dadata.react-dadata__container')).toExist();
    expect(wrapper.find('input.react-dadata__input')).not.toExist();
    const input = wrapper.find('input.input-class-name');
    expect(input).toExist();
    expect(input).toHaveProp('autoComplete', 'tel');
    expect(input).toHaveProp('aria-label', 'Test aria label');
  });

  it('correctly fire onChange callback', async () => {
    const handleChangeMock = jest.fn();
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" inputProps={{ onChange: handleChangeMock }} />);
    const input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'Мо' } });
    await delay(10);
    expect(handleChangeMock.mock.calls.length).toBe(1);
    expect(handleChangeMock.mock.calls[0][0].target.value).toBe('Мо');
  });

  it('correctly type and select suggestions', async () => {
    const handleFocusMock = jest.fn();
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" inputProps={{ onFocus: handleFocusMock }} />);
    const input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    wrapper.update();
    expect(wrapper).toHaveState('isFocused', true);
    expect(handleFocusMock.mock.calls.length).toBe(1);
    input.simulate('change', { target: { value: 'Мо' } });
    await delay(10);
    wrapper.update();
    const suggestionsWrapper = wrapper.find('ul.react-dadata__suggestions');
    expect(suggestionsWrapper).toExist();
    expect(suggestionsWrapper.find('button.react-dadata__suggestion').length).toBe(7);
  });

  it('correctly fire blur', async () => {
    const handleBlurMock = jest.fn();
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" inputProps={{ onBlur: handleBlurMock }} />);
    const input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    expect(wrapper).toHaveState('isFocused', true);
    input.simulate('blur');
    expect(wrapper).toHaveState('isFocused', false);
    expect(handleBlurMock.mock.calls.length).toBe(1);
  });

  it('correctly show 0 suggestions with minChars', async () => {
    const handleFocusMock = jest.fn();
    const wrapper = mount(
      <AddressSuggestions token="TEST_TOKEN" inputProps={{ onFocus: handleFocusMock }} minChars={3} />,
    );
    const input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    expect(handleFocusMock.mock.calls.length).toBe(1);
    input.simulate('change', { target: { value: 'Мо' } });
    await delay(10);
    wrapper.update();
    let suggestionsWrapper = wrapper.find('ul.react-dadata__suggestions');
    expect(suggestionsWrapper.exists()).toBe(false);

    input.simulate('change', { target: { value: 'Мос' } });
    await delay(10);
    wrapper.update();
    suggestionsWrapper = wrapper.find('ul.react-dadata__suggestions');
    expect(suggestionsWrapper.exists()).toBe(true);
    expect(suggestionsWrapper.find('button.react-dadata__suggestion').length).toBe(7);
  });

  it('it respects defaultQuery or value on mount', async () => {
    let wrapper = mount(<AddressSuggestions token="TEST_TOKEN" />);
    let input = wrapper.find('input.react-dadata__input');
    expect(input).toHaveValue('');

    wrapper = mount(<AddressSuggestions token="TEST_TOKEN" defaultQuery="My Query" />);
    input = wrapper.find('input.react-dadata__input');
    expect(input).toHaveValue('My Query');

    wrapper = mount(<AddressSuggestions token="TEST_TOKEN" defaultQuery="My Query" value={addressMockKrasnodar} />);
    input = wrapper.find('input.react-dadata__input');
    expect(input).toHaveValue('My Query');

    wrapper = mount(<AddressSuggestions token="TEST_TOKEN" value={addressMockKrasnodar} />);
    input = wrapper.find('input.react-dadata__input');
    expect(input).toHaveValue('Краснодарский край, Мостовский р-н');
  });

  it('change value changes input query', async () => {
    const wrapper = mount<AddressSuggestions>(<AddressSuggestions token="TEST_TOKEN" />);
    let input = wrapper.find('input.react-dadata__input');
    expect(input).toHaveValue('');
    wrapper.setProps({ value: addressMockKrasnodar });
    wrapper.update();
    input = wrapper.find('input.react-dadata__input');
    expect(input).toHaveValue('Краснодарский край, Мостовский р-н');
  });

  it('correctly navigate by keyboard down arrow', async () => {
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" />);
    let input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'Мо' } });
    await delay(10);
    wrapper.update();
    expect(wrapper).toHaveState('suggestionIndex', -1);
    let suggestionsWrapper = wrapper.find('ul.react-dadata__suggestions');
    expect(suggestionsWrapper.exists()).toBe(true);
    expect(suggestionsWrapper.find('button.react-dadata__suggestion').length).toBe(7);
    input.simulate('keypress', { which: 40 });
    await delay(10);
    wrapper.update();
    expect(wrapper).toHaveState('suggestionIndex', 0);
    suggestionsWrapper = wrapper.find('ul.react-dadata__suggestions');
    expect(suggestionsWrapper.find('button.react-dadata__suggestion').at(0)).toHaveClassName(
      'react-dadata__suggestion--current',
    );
    input = wrapper.find('input.react-dadata__input');
    expect(input).toHaveValue('г Москва');
    input.simulate('keypress', { which: 40 });
    await delay(10);
    wrapper.update();
    expect(wrapper).toHaveState('suggestionIndex', 1);
    suggestionsWrapper = wrapper.find('ul.react-dadata__suggestions');
    expect(suggestionsWrapper.find('button.react-dadata__suggestion').at(1)).toHaveClassName(
      'react-dadata__suggestion--current',
    );
    input = wrapper.find('input.react-dadata__input');
    expect(input).toHaveValue('Московская обл');
    input.simulate('keypress', { which: 40 });
    input.simulate('keypress', { which: 40 });
    input.simulate('keypress', { which: 40 });
    input.simulate('keypress', { which: 40 });
    input.simulate('keypress', { which: 40 });
    input.simulate('keypress', { which: 40 });
    input.simulate('keypress', { which: 40 });
    input.simulate('keypress', { which: 40 });
    await delay(10);
    wrapper.update();
    expect(wrapper).toHaveState('suggestionIndex', 6);
    suggestionsWrapper = wrapper.find('ul.react-dadata__suggestions');
    expect(suggestionsWrapper.find('button.react-dadata__suggestion').at(6)).toHaveClassName(
      'react-dadata__suggestion--current',
    );
    input = wrapper.find('input.react-dadata__input');
    expect(input).toHaveValue('Удмуртская Респ, г Можга');
  });

  it('correctly fire onKeyDown and onKeyPress', async () => {
    const handleKeyDownMock = jest.fn();
    const handleKeyPressMock = jest.fn();
    const wrapper = mount(
      <AddressSuggestions
        token="TEST_TOKEN"
        inputProps={{
          onKeyDown: handleKeyDownMock,
          onKeyPress: handleKeyPressMock,
        }}
      />,
    );
    const input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'Мо' } });
    input.simulate('keypress', { which: 40 });
    input.simulate('keydown', { which: 40 });
    expect(handleKeyDownMock.mock.calls.length).toBe(1);
    expect(handleKeyPressMock.mock.calls.length).toBe(1);
  });

  it('correctly navigate by keyboard up arrow', async () => {
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" />);
    let input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'Мо' } });
    await delay(10);
    wrapper.update();
    let suggestionsWrapper = wrapper.find('ul.react-dadata__suggestions');
    expect(suggestionsWrapper.exists()).toBe(true);
    expect(suggestionsWrapper.find('button.react-dadata__suggestion').length).toBe(7);
    input.simulate('keypress', { which: 40 });
    await delay(10);
    wrapper.update();
    expect(wrapper).toHaveState('suggestionIndex', 0);
    suggestionsWrapper = wrapper.find('ul.react-dadata__suggestions');
    expect(suggestionsWrapper.find('button.react-dadata__suggestion').at(0)).toHaveClassName(
      'react-dadata__suggestion--current',
    );
    input = wrapper.find('input.react-dadata__input');
    expect(input).toHaveValue('г Москва');
    input.simulate('keypress', { which: 38 });
    await delay(10);
    wrapper.update();
    input = wrapper.find('input.react-dadata__input');
    expect(input).toHaveValue('Мо');
    expect(wrapper).toHaveState('suggestionIndex', -1);
    input.simulate('keypress', { which: 38 });
    input.simulate('keypress', { which: 38 });
    await delay(10);
    wrapper.update();
    input = wrapper.find('input.react-dadata__input');
    expect(input).toHaveValue('Мо');
    expect(wrapper).toHaveState('suggestionIndex', -1);
  });

  it('correctly fire onChange by Enter', async () => {
    const handleChangeMock = jest.fn();
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" onChange={handleChangeMock} />);
    let input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'Мо' } });
    await delay(10);
    wrapper.update();
    const suggestionsWrapper = wrapper.find('ul.react-dadata__suggestions');
    expect(suggestionsWrapper.exists()).toBe(true);
    expect(suggestionsWrapper.find('button.react-dadata__suggestion').length).toBe(7);
    input.simulate('keypress', { which: 13 });
    input = wrapper.find('input.react-dadata__input');
    expect(handleChangeMock.mock.calls.length).toBe(0);
    input.simulate('keydown', { which: 40 });
    input = wrapper.find('input.react-dadata__input');
    input.simulate('keypress', { which: 13 });
    await delay(10);
    expect(handleChangeMock.mock.calls.length).toBe(1);
    expect(handleChangeMock.mock.calls[0][0].value).toBe('г Москва');
  });

  it('correctly fire onChange by suggestion click', async () => {
    const handleChangeMock = jest.fn();
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" onChange={handleChangeMock} />);
    const input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'Мо' } });
    await delay(10);
    wrapper.update();
    const suggestionsWrapper = wrapper.find('ul.react-dadata__suggestions');
    expect(suggestionsWrapper.exists()).toBe(true);
    expect(suggestionsWrapper.find('button.react-dadata__suggestion').length).toBe(7);
    const firstSuggestion = suggestionsWrapper.find('button.react-dadata__suggestion').at(1);
    firstSuggestion.simulate('mousedown');
    expect(handleChangeMock.mock.calls.length).toBe(1);
    expect(handleChangeMock.mock.calls[0][0].value).toBe('Московская обл');
  });

  it('correctly send http parameters', async () => {
    const wrapper = mount(
      <AddressSuggestions
        token="TEST_TOKEN"
        count={20}
        filterLanguage="en"
        filterFromBound="country"
        filterToBound="street"
        filterLocations={[{ kladr_id: '65' }]}
        filterLocationsBoost={[{ kladr_id: '77' }]}
      />,
    );
    const input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    expect(requestCalls.length).toBe(1);
    expect(requestCalls[0].data.json.query).toBe('');
    expect(requestCalls[0].endpoint).toBe('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address');
    input.simulate('change', { target: { value: 'Мо' } });
    expect(requestCalls.length).toBe(2);
    expect(requestCalls[1].data.json.query).toBe('Мо');
    expect(requestCalls[1].data.json.language).toBe('en');
    expect(requestCalls[1].data.json.from_bound).toEqual({ value: 'country' });
    expect(requestCalls[1].data.json.to_bound).toEqual({ value: 'street' });
    expect(requestCalls[1].data.json.locations).toEqual([{ kladr_id: '65' }]);
    expect(requestCalls[1].data.json.locations_boost).toEqual([{ kladr_id: '77' }]);
  });

  it('respects debounce', async () => {
    jest.useFakeTimers();
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" />);
    const input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'М' } });
    input.simulate('change', { target: { value: 'Мо' } });
    expect(requestCalls.length).toBe(3);

    wrapper.setProps({ delay: 50 });
    input.simulate('change', { target: { value: 'М' } });
    input.simulate('change', { target: { value: 'Мо' } });
    expect(requestCalls.length).toBe(3);
    jest.advanceTimersByTime(50);
    expect(requestCalls.length).toBe(4);
    expect(requestCalls[3].data.json.query).toBe('Мо');
    jest.useRealTimers();
  });

  it('fires ref method setInputValue fired', async () => {
    const wrapper = mount<AddressSuggestions>(<AddressSuggestions token="TEST_TOKEN" />);
    wrapper.instance().setInputValue('Test Value');
    wrapper.update();
    const input = wrapper.find('input.react-dadata__input');
    expect(input).toHaveValue('Test Value');
  });

  it('fires ref method focus fired', async () => {
    const handleFocusMock = jest.fn();
    const wrapper = mount<AddressSuggestions>(
      <AddressSuggestions
        token="TEST_TOKEN"
        inputProps={{
          onFocus: handleFocusMock,
        }}
      />,
    );
    wrapper.update();
    wrapper.instance().focus();
  });

  it('correctly renders with renderOption', async () => {
    const renderOption: (suggestion: DaDataSuggestion<DaDataAddress>) => ReactNode = (suggestion) => {
      return <span className="test-class">{suggestion.data.country}</span>;
    };
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" renderOption={renderOption} />);
    const input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'Мо' } });
    await delay(10);
    wrapper.update();
    const suggestionsWrapper = wrapper.find('ul.react-dadata__suggestions');
    expect(suggestionsWrapper.exists()).toBe(true);
    expect(suggestionsWrapper.find('button.react-dadata__suggestion').at(0).html()).toBe(
      '<button role="option" aria-selected="false" class="react-dadata__suggestion"><span class="test-class">Россия</span></button>',
    );
  });

  it('correctly renders with customInput', async () => {
    const CustomInput = React.forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>((props, ref) => (
      <input ref={ref} {...props} data-some-attr="foo" />
    ));

    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" customInput={CustomInput} />);
    const input = wrapper.find('input.react-dadata__input[data-some-attr="foo"]');
    expect(input.exists()).toBe(true);
  });

  it('passes current input value to renderOption', async () => {
    const renderOption = jest.fn<React.ReactNode, [DaDataSuggestion<DaDataAddress>, string]>(
      (suggestion: DaDataSuggestion<DaDataAddress>): ReactNode => {
        return suggestion.value;
      },
    );
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" renderOption={renderOption} />);
    const input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'Мо' } });
    await delay(0);

    expect(renderOption.mock.calls[renderOption.mock.calls.length - 1][1]).toBe('Мо');

    input.simulate('change', { target: { value: 'Мос' } });
    await delay(0);
    expect(renderOption.mock.calls[renderOption.mock.calls.length - 1][1]).toBe('Мос');
  });

  it('uses url property if provided', async () => {
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" url="https://example.com" />);
    const input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'Мо' } });
    await delay(0);

    expect(makeRequestMock.mock.calls[makeRequestMock.mock.calls.length - 1][1]).toBe('https://example.com');
  });

  it('respects selectOnBlur prop', async () => {
    const handleChangeMock = jest.fn();
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" onChange={handleChangeMock} selectOnBlur />);
    const input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'Мо' } });
    await delay(10);
    wrapper.update();
    input.simulate('blur');
    expect(handleChangeMock.mock.calls.length).toBe(1);
    expect(handleChangeMock.mock.calls[0][0].value).toBe('г Москва');
  });
});
