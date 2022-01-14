import React, { createRef, HTMLProps, ReactNode } from 'react';
import {
  cleanup,
  findAllByRole,
  fireEvent,
  getAllByRole,
  queryAllByRole,
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddressSuggestions } from '../AddressSuggestions';
import { createAddressMock, addressMockKrasnodar, requestCalls, addressMocks } from './mocks';
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

describe('AddressSuggestions', () => {
  it('is truthy', () => {
    expect(AddressSuggestions).toBeTruthy();
  });

  it('AddressSuggestions renders correctly', () => {
    render(<AddressSuggestions token="TEST_TOKEN" />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('input renders correctly with props', () => {
    const inputProps: HTMLProps<HTMLInputElement> = {
      autoComplete: 'tel',
      'aria-label': 'Test aria label',
      className: 'input-class-name',
    };

    render(<AddressSuggestions token="TEST_TOKEN" inputProps={inputProps} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Test aria label');
    expect(input).toHaveAttribute('autoComplete', 'tel');
    expect(input).toHaveAttribute('class', 'input-class-name');
  });

  it('correctly fire onChange callback', async () => {
    const handleChangeMock = jest.fn();

    render(<AddressSuggestions token="TEST_TOKEN" inputProps={{ onChange: handleChangeMock }} />);

    const input = await screen.findByRole('textbox');

    userEvent.tab();
    userEvent.type(input, 'М');

    expect(handleChangeMock).toBeCalledTimes(1);
    expect(handleChangeMock.mock.calls[0][0].target.value).toBe('М');
  });

  it('correctly type and select suggestions', async () => {
    const handleFocusMock = jest.fn();

    render(<AddressSuggestions token="TEST_TOKEN" inputProps={{ onFocus: handleFocusMock }} />);

    const input = await screen.findByRole('textbox');

    userEvent.tab();

    expect(input).toHaveFocus();
    expect(handleFocusMock.mock.calls.length).toBe(1);

    userEvent.type(input, 'Мо');

    const listBox = await screen.findByRole('listbox');
    expect(listBox).toBeInTheDocument();
    expect(getAllByRole(listBox, 'option')).toHaveLength(7);
  });

  it('correctly fire blur', async () => {
    const handleBlurMock = jest.fn();

    render(<AddressSuggestions token="TEST_TOKEN" inputProps={{ onBlur: handleBlurMock }} />);

    userEvent.tab();

    expect(await screen.findByRole('textbox')).toHaveFocus();
    expect(handleBlurMock).not.toBeCalled();

    userEvent.tab();
    expect(await screen.findByRole('textbox')).not.toHaveFocus();
    expect(handleBlurMock).toBeCalledTimes(1);
  });

  it('correctly show 0 suggestions with minChars', async () => {
    const handleFocusMock = jest.fn();

    render(<AddressSuggestions token="TEST_TOKEN" inputProps={{ onFocus: handleFocusMock }} minChars={3} />);
    const input = await screen.findByRole('textbox');

    userEvent.tab();

    userEvent.type(input, 'Мо');
    expect(await screen.queryByRole('listbox')).not.toBeInTheDocument();

    userEvent.type(input, 'с');
    const listBox = await screen.findByRole('listbox');
    expect(listBox).toBeInTheDocument();

    expect(getAllByRole(listBox, 'option')).toHaveLength(7);
  });

  it('it respects defaultQuery or value on mount', async () => {
    render(<AddressSuggestions token="TEST_TOKEN" />);
    expect(await screen.findByRole('textbox')).toHaveValue('');
    cleanup();

    render(<AddressSuggestions token="TEST_TOKEN" defaultQuery="My Query" />);
    expect(await screen.findByRole('textbox')).toHaveValue('My Query');
    cleanup();

    render(<AddressSuggestions token="TEST_TOKEN" defaultQuery="My Query" value={addressMockKrasnodar} />);
    expect(await screen.findByRole('textbox')).toHaveValue('My Query');
    cleanup();

    render(<AddressSuggestions token="TEST_TOKEN" value={addressMockKrasnodar} />);
    expect(await screen.findByRole('textbox')).toHaveValue('Краснодарский край, Мостовский р-н');
  });

  it('change value changes input query', async () => {
    const { rerender } = render(<AddressSuggestions token="TEST_TOKEN" />);

    expect(await screen.findByRole('textbox')).toHaveValue('');

    rerender(<AddressSuggestions token="TEST_TOKEN" value={addressMockKrasnodar} />);
    expect(await screen.findByRole('textbox')).toHaveValue('Краснодарский край, Мостовский р-н');
  });

  it('correctly navigate by keyboard up and down arrows', async () => {
    render(<AddressSuggestions token="TEST_TOKEN" />);

    const input = await screen.findByRole('textbox');
    userEvent.tab();
    userEvent.type(input, 'М');

    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(7);
    expect(screen.queryByRole('option', { selected: true })).not.toBeInTheDocument();

    userEvent.type(input, '{arrowdown}');
    expect(screen.getByRole('option', { selected: true })).toBeInTheDocument();
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('г Москва');
    expect(input).toHaveValue('г Москва');

    userEvent.type(input, '{arrowdown}');
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Московская обл');
    expect(input).toHaveValue('Московская обл');

    userEvent.type(input, '{arrowup}');
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('г Москва');
    expect(input).toHaveValue('г Москва');

    userEvent.type(input, '{arrowdown}');
    userEvent.type(input, '{arrowdown}');
    userEvent.type(input, '{arrowdown}');
    userEvent.type(input, '{arrowdown}');
    userEvent.type(input, '{arrowdown}');
    userEvent.type(input, '{arrowdown}');
    userEvent.type(input, '{arrowdown}');
    userEvent.type(input, '{arrowdown}');
    userEvent.type(input, '{arrowdown}');
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Магаданская обл');
    expect(input).toHaveValue('Магаданская обл');

    userEvent.type(input, '{arrowdown}');
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Магаданская обл');
    expect(input).toHaveValue('Магаданская обл');
  });

  it('correctly fire onKeyDown and onKeyPress', async () => {
    const handleKeyDownMock = jest.fn();
    const handleKeyPressMock = jest.fn();
    render(
      <AddressSuggestions
        token="TEST_TOKEN"
        inputProps={{
          onKeyDown: handleKeyDownMock,
          onKeyPress: handleKeyPressMock,
        }}
      />,
    );

    const input = await screen.findByRole('textbox');

    fireEvent.keyPress(input, { key: 'ArrowDown', charCode: 40 });
    expect(handleKeyPressMock).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(input, { key: 'ArrowDown', charCode: 40 });
    expect(handleKeyDownMock).toHaveBeenCalledTimes(1);
  });

  it('correctly fire onChange by Enter', async () => {
    const handleChangeMock = jest.fn();

    render(<AddressSuggestions token="TEST_TOKEN" onChange={handleChangeMock} />);

    const input = await screen.findByRole('textbox');

    userEvent.tab();
    userEvent.type(input, 'Мо');

    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    userEvent.type(input, '{enter}');

    expect(handleChangeMock).toBeCalledTimes(0);
    userEvent.type(input, '{arrowdown}{enter}');

    expect(handleChangeMock.mock.calls.length).toBe(1);
    expect(handleChangeMock.mock.calls[0][0].value).toBe('г Москва');
  });

  it('correctly fire onChange by suggestion click', async () => {
    const handleChangeMock = jest.fn();

    render(<AddressSuggestions token="TEST_TOKEN" onChange={handleChangeMock} />);
    const input = await screen.findByRole('textbox');

    userEvent.tab();
    userEvent.type(input, 'Мо', { delay: 0 });

    const listBox = await screen.findByRole('listbox');
    expect(listBox).toBeInTheDocument();

    const options = queryAllByRole(listBox, 'option');

    userEvent.click(options[1]);
    expect(handleChangeMock).toHaveBeenCalledTimes(1);
    expect(handleChangeMock).toHaveBeenCalledWith(addressMocks['Мо'][1]);
  });

  it('correctly send http parameters', async () => {
    render(
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

    const input = await screen.findByRole('textbox');
    userEvent.tab();

    expect(requestCalls.length).toBe(1);
    expect(requestCalls[0].data.json.query).toBe('');
    expect(requestCalls[0].endpoint).toBe('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address');

    userEvent.type(input, 'Мо');

    expect(requestCalls.length).toBe(3);
    expect(requestCalls[2].data.json.query).toBe('Мо');
    expect(requestCalls[2].data.json.language).toBe('en');
    expect(requestCalls[2].data.json.from_bound).toEqual({ value: 'country' });
    expect(requestCalls[2].data.json.to_bound).toEqual({ value: 'street' });
    expect(requestCalls[2].data.json.locations).toEqual([{ kladr_id: '65' }]);
    expect(requestCalls[2].data.json.locations_boost).toEqual([{ kladr_id: '77' }]);
  });

  it('respects debounce', async () => {
    jest.useFakeTimers();

    render(<AddressSuggestions token="TEST_TOKEN" />);
    const input = await screen.findByRole('textbox');

    userEvent.tab();
    userEvent.type(input, 'Мо');

    expect(requestCalls.length).toBe(3);

    cleanup();
    render(<AddressSuggestions token="TEST_TOKEN" delay={50} />);

    userEvent.tab();
    userEvent.type(input, 'Мо');

    expect(requestCalls.length).toBe(3);
    jest.advanceTimersByTime(50);
    expect(requestCalls.length).toBe(4);
    expect(requestCalls[3].data.json.query).toBe('Мо');
    jest.useRealTimers();
  });

  it('fires ref method setInputValue fired', async () => {
    const ref = createRef<AddressSuggestions>();
    render(<AddressSuggestions token="TEST_TOKEN" ref={ref} />);

    ref.current?.setInputValue('Test Value');
    expect(await screen.findByRole('textbox')).toHaveValue('Test Value');
  });

  it('fires ref method focus fired', async () => {
    const ref = createRef<AddressSuggestions>();

    render(<AddressSuggestions token="TEST_TOKEN" ref={ref} />);

    ref.current?.focus();
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('correctly renders with renderOption', async () => {
    const renderOption: (suggestion: DaDataSuggestion<DaDataAddress>) => ReactNode = (suggestion) => {
      return <span className="test-class">RenderOption {suggestion.data.country}</span>;
    };

    render(<AddressSuggestions token="TEST_TOKEN" renderOption={renderOption} />);

    const input = await screen.findByRole('textbox');
    userEvent.tab();
    userEvent.type(input, 'Мо');

    const listBox = await screen.findByRole('listbox');
    expect(listBox).toBeInTheDocument();

    const suggestions = await findAllByRole(listBox, 'option');
    expect(suggestions).toHaveLength(7);

    expect(suggestions[0]).toHaveTextContent('RenderOption Россия');
  });

  it('correctly renders with customInput', async () => {
    const CustomInput = React.forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>((props, ref) => (
      <input ref={ref} {...props} data-some-attr="foo" />
    ));

    render(<AddressSuggestions token="TEST_TOKEN" customInput={CustomInput} />);
    const input = await screen.findByRole('textbox');

    expect(input).toHaveAttribute('data-some-attr', 'foo');
  });

  it('passes current input value to renderOption', async () => {
    const renderOption = jest.fn<React.ReactNode, [DaDataSuggestion<DaDataAddress>, string]>(
      (suggestion: DaDataSuggestion<DaDataAddress>): ReactNode => {
        return suggestion.value;
      },
    );

    render(<AddressSuggestions token="TEST_TOKEN" renderOption={renderOption} />);

    const input = await screen.findByRole('textbox');

    userEvent.tab();
    userEvent.type(input, 'Мо');

    expect(await screen.findByRole('listbox')).toBeInTheDocument();

    expect(renderOption.mock.calls[renderOption.mock.calls.length - 1][1]).toBe('Мо');

    userEvent.type(input, 'с');
    expect(renderOption.mock.calls[renderOption.mock.calls.length - 1][1]).toBe('Мос');
  });

  it('uses url property if provided', async () => {
    render(<AddressSuggestions token="TEST_TOKEN" url="https://example.com" />);

    const input = await screen.findByRole('textbox');

    userEvent.tab();
    userEvent.type(input, 'Мос');

    expect(makeRequestMock.mock.calls[makeRequestMock.mock.calls.length - 1][1]).toBe('https://example.com');
  });

  it('respects selectOnBlur prop', async () => {
    const handleChangeMock = jest.fn();

    render(<AddressSuggestions token="TEST_TOKEN" onChange={handleChangeMock} selectOnBlur />);

    userEvent.tab();

    const input = await screen.findByRole('textbox');
    userEvent.type(input, 'Мо');

    const listBox = await screen.findByRole('listbox');
    expect(listBox).toBeInTheDocument();

    userEvent.tab();

    expect(handleChangeMock.mock.calls.length).toBe(1);
    expect(handleChangeMock.mock.calls[0][0].value).toBe('г Москва');
  });
});
