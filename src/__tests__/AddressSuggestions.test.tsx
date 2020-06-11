import React, { HTMLProps } from 'react';
import { mount } from 'enzyme';
import { AddressSuggestions } from '../AddressSuggestions';
import { addressMockKrasnodar } from './mocks';

jest.mock('../request', () => {
  // eslint-disable-next-line
  const mocks = require('./mocks');
  return {
    makeRequest: mocks.createAddressMock(),
  }
});

const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

describe('AddressSuggestions', () => {
  it('is truthy', () => {
    expect(AddressSuggestions).toBeTruthy();
  });

  it('AddressSuggestions renders correctly', () => {
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" />);
    expect(wrapper.find('div.react-dadata.react-dadata__container')).toExist();
    expect(wrapper.find('input.react-dadata__input')).toExist();
    expect(wrapper.find('div.react-dadata__suggestions')).not.toExist();
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

  it('correctly type and select suggestions', async () => {
    const handleFocusMock = jest.fn();
    const wrapper = mount(<AddressSuggestions token="TEST_TOKEN" inputProps={{ onFocus: handleFocusMock }} />);
    const input = wrapper.find('input.react-dadata__input');
    input.simulate('focus');
    expect(handleFocusMock.mock.calls.length).toBe(1);
    input.simulate('change', { target: { value: 'Мо' } });
    await delay(10);
    wrapper.update();
    const suggestionsWrapper = wrapper.find('div.react-dadata__suggestions');
    expect(suggestionsWrapper).toExist();
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
});
