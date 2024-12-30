import {
  cleanup,
  findAllByRole,
  fireEvent,
  getAllByRole,
  queryAllByRole,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { type SetupServerApi, setupServer } from 'msw/node';
import React, { createRef, forwardRef, type HTMLProps, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
// import { debug } from 'vitest-preview';
import * as requestModule from '../request';
import { AddressSuggestions } from '../variants/address/address-suggestions';
import type { DaDataAddressSuggestion } from '../variants/address/address-types';
import { addressMockKrasnodar, addressMocks, createAddressMock, mockedRequestCalls } from './mocks';

type RequestLog = {
  method: string;
  endpoint: string;
  data: Record<string, unknown>;
};

let server: SetupServerApi;
let requestCalls: RequestLog[] = [];

// const delay = (ms: number) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// };

beforeEach(() => {
  requestCalls = [];

  server = setupServer(
    http.post<{ query: string }, Record<string, unknown>>(
      '*/suggestions/api/4_1/rs/suggest/address',
      async ({ request }) => {
        const data = await request.json();

        requestCalls.push({ method: request.method, endpoint: request.url.toString(), data });

        const { query } = data;

        if (query && typeof query === 'string') {
          return HttpResponse.json({ suggestions: addressMocks[query] });
        }
        return HttpResponse.json({ suggestions: [] });
      },
    ),
  );

  server.listen();
});

afterEach(() => {
  server.close();
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

  it("correctly fires input's onChange callback", async () => {
    const handleChangeMock = vi.fn();

    render(<AddressSuggestions token="TEST_TOKEN" inputProps={{ onChange: handleChangeMock }} />);

    const input = await screen.findByRole('textbox');

    await userEvent.tab();
    await userEvent.type(input, 'М');

    expect(handleChangeMock).toBeCalledTimes(1);
    expect(handleChangeMock.mock.calls[0][0].target.value).toBe('М');
  });

  it('correctly types and selects suggestions', async () => {
    const handleFocusMock = vi.fn();
    const handleChangeMock = vi.fn();

    render(
      <AddressSuggestions token="TEST_TOKEN" onChange={handleChangeMock} inputProps={{ onFocus: handleFocusMock }} />,
    );

    const input = await screen.findByRole('textbox');

    await userEvent.tab();

    expect(input).toHaveFocus();
    expect(handleFocusMock.mock.calls.length).toBe(1);

    await userEvent.type(input, 'Мо');

    const listBox = await screen.findByRole('listbox');
    expect(listBox).toBeInTheDocument();
    expect(getAllByRole(listBox, 'option')).toHaveLength(7);

    await userEvent.click(screen.getAllByRole('option')[0]);
    expect(input).toHaveFocus();
  });

  it('correctly fires blur', async () => {
    const handleBlurMock = vi.fn();

    render(<AddressSuggestions token="TEST_TOKEN" inputProps={{ onBlur: handleBlurMock }} />);

    await userEvent.tab();

    expect(await screen.findByRole('textbox')).toHaveFocus();
    expect(handleBlurMock).not.toBeCalled();

    await userEvent.tab();
    expect(await screen.findByRole('textbox')).not.toHaveFocus();
    expect(handleBlurMock).toBeCalledTimes(1);
  });

  it('correctly shows 0 suggestions with minChars', async () => {
    const handleFocusMock = vi.fn();

    render(<AddressSuggestions token="TEST_TOKEN" inputProps={{ onFocus: handleFocusMock }} minChars={3} />);
    const input = await screen.findByRole('textbox');

    await userEvent.tab();

    await userEvent.type(input, 'Мо');
    expect(await screen.queryByRole('listbox')).not.toBeInTheDocument();

    await userEvent.type(input, 'с');
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

  it('changes value changes input query', async () => {
    const { rerender } = render(<AddressSuggestions token="TEST_TOKEN" />);

    expect(await screen.findByRole('textbox')).toHaveValue('');

    rerender(<AddressSuggestions token="TEST_TOKEN" value={addressMockKrasnodar} />);
    expect(await screen.findByRole('textbox')).toHaveValue('Краснодарский край, Мостовский р-н');
  });

  it('correctly navigates by keyboard up and down arrows', async () => {
    render(<AddressSuggestions token="TEST_TOKEN" />);

    const input = await screen.findByRole('textbox');
    await userEvent.tab();
    await userEvent.type(input, 'М');

    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(7);
    expect(screen.queryByRole('option', { selected: true })).not.toBeInTheDocument();

    await userEvent.type(input, '{arrowdown}');
    expect(screen.getByRole('option', { selected: true })).toBeInTheDocument();
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('г Москва');
    expect(input).toHaveValue('г Москва');

    await userEvent.type(input, '{arrowdown}');
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Московская обл');
    expect(input).toHaveValue('Московская обл');

    await userEvent.type(input, '{arrowup}');
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('г Москва');
    expect(input).toHaveValue('г Москва');

    await userEvent.type(input, '{arrowdown}');
    await userEvent.type(input, '{arrowdown}');
    await userEvent.type(input, '{arrowdown}');
    await userEvent.type(input, '{arrowdown}');
    await userEvent.type(input, '{arrowdown}');
    await userEvent.type(input, '{arrowdown}');
    await userEvent.type(input, '{arrowdown}');
    await userEvent.type(input, '{arrowdown}');
    await userEvent.type(input, '{arrowdown}');
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Магаданская обл');
    expect(input).toHaveValue('Магаданская обл');

    await userEvent.type(input, '{arrowdown}');
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('Магаданская обл');
    expect(input).toHaveValue('Магаданская обл');
  });

  it('correctly fires onKeyDown and onKeyPress', async () => {
    const handleKeyDownMock = vi.fn();
    const handleKeyPressMock = vi.fn();
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

  it('correctly fires onChange by Enter', async () => {
    const handleChangeMock = vi.fn();

    render(<AddressSuggestions token="TEST_TOKEN" onChange={handleChangeMock} />);

    const input = await screen.findByRole('textbox');

    await userEvent.tab();
    await userEvent.type(input, 'Мо');

    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    await userEvent.type(input, '{Enter}');

    expect(handleChangeMock).toBeCalledTimes(0);
    await userEvent.type(input, '{ArrowDown}{Enter}');

    expect(handleChangeMock.mock.calls.length).toBe(1);
    expect(handleChangeMock.mock.calls[0][0].value).toBe('г Москва');
  });

  it('correctly fires onChange by suggestion click', async () => {
    const handleChangeMock = vi.fn();

    render(<AddressSuggestions token="TEST_TOKEN" onChange={handleChangeMock} />);
    const input = await screen.findByRole('textbox');

    await userEvent.tab();
    await userEvent.type(input, 'Мо', { delay: 0 });

    const listBox = await screen.findByRole('listbox');
    expect(listBox).toBeInTheDocument();

    const options = queryAllByRole(listBox, 'option');

    await userEvent.click(options[1]);
    expect(handleChangeMock).toHaveBeenCalledTimes(1);
    expect(handleChangeMock).toHaveBeenCalledWith(addressMocks.Мо[1]);
  });

  it('correctly sends http parameters', async () => {
    render(
      <AddressSuggestions
        token="TEST_TOKEN"
        count={20}
        filterLanguage="en"
        filterFromBound="country"
        filterToBound="street"
        filterLocations={[{ kladr_id: '65' }]}
        filterLocationsBoost={[{ kladr_id: '77' }]}
        filterRestrictValue
      />,
    );

    const input = await screen.findByRole('textbox');
    await userEvent.tab();

    await waitFor(() => {
      expect(requestCalls.length).toBe(1);
      expect(requestCalls.length).toBe(1);
      expect(requestCalls[0].data.query).toBe('');
      expect(requestCalls[0].endpoint).toBe('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address');
    });

    await userEvent.type(input, 'Мо');

    await waitFor(() => {
      expect(requestCalls.length).toBe(3);
      expect(requestCalls[2].data.query).toBe('Мо');
      expect(requestCalls[2].data.language).toBe('en');
      expect(requestCalls[2].data.from_bound).toEqual({ value: 'country' });
      expect(requestCalls[2].data.to_bound).toEqual({ value: 'street' });
      expect(requestCalls[2].data.locations).toEqual([{ kladr_id: '65' }]);
      expect(requestCalls[2].data.locations_boost).toEqual([{ kladr_id: '77' }]);
      expect(requestCalls[2].data.restrict_value).toBe(true);
    });
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
    expect(await screen.findByRole('textbox')).toHaveFocus();
  });

  it('respects debounce', async () => {
    const makeRequestMock = vi.spyOn(requestModule, 'makeRequest');
    makeRequestMock.mockImplementation(createAddressMock());

    vi.useFakeTimers({ shouldAdvanceTime: true });

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<AddressSuggestions token="TEST_TOKEN" />);
    const input = await screen.findByRole('textbox');

    await user.tab();
    await user.type(input, 'Мо');

    expect(mockedRequestCalls.length).toBe(3);

    cleanup();

    const { rerender } = render(<AddressSuggestions token="TEST_TOKEN" delay={50} />);

    await user.tab();
    await user.type(input, 'Мо');

    expect(mockedRequestCalls.length).toBe(3);
    vi.advanceTimersByTime(50);
    expect(mockedRequestCalls.length).toBe(4);
    expect(mockedRequestCalls[3].data.json.query).toBe('Мо');

    rerender(<AddressSuggestions token="TEST_TOKEN" delay={100} />);
    await userEvent.type(input, 'ск');
    expect(mockedRequestCalls.length).toBe(4);
    vi.advanceTimersByTime(50);
    expect(mockedRequestCalls.length).toBe(4);
    vi.advanceTimersByTime(50);
    expect(mockedRequestCalls.length).toBe(5);
    expect(mockedRequestCalls[4].data.json.query).toBe('Моск');

    // vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('correctly renders with renderOption', async () => {
    const renderOption: (suggestion: DaDataAddressSuggestion) => ReactNode = (suggestion) => {
      return <span className="test-class">RenderOption {suggestion.data.country}</span>;
    };

    render(<AddressSuggestions token="TEST_TOKEN" renderOption={renderOption} />);

    const input = await screen.findByRole('textbox');
    await userEvent.tab();
    await userEvent.type(input, 'Мо');

    const listBox = await screen.findByRole('listbox');
    expect(listBox).toBeInTheDocument();

    const suggestions = await findAllByRole(listBox, 'option');
    expect(suggestions).toHaveLength(7);

    expect(suggestions[0]).toHaveTextContent('RenderOption Россия');
  });

  it('correctly renders with customInput', async () => {
    const CustomInput = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>((props, ref) => (
      <input ref={ref} {...props} data-some-attr="foo" />
    ));

    render(<AddressSuggestions token="TEST_TOKEN" customInput={CustomInput} />);
    const input = await screen.findByRole('textbox');

    expect(input).toHaveAttribute('data-some-attr', 'foo');
  });

  it('passes current input value to renderOption', async () => {
    const renderOption = vi.fn<(suggestion: DaDataAddressSuggestion, query: string) => ReactNode>(
      (suggestion: DaDataAddressSuggestion): ReactNode => {
        return suggestion.value;
      },
    );

    render(<AddressSuggestions token="TEST_TOKEN" renderOption={renderOption} />);

    const input = await screen.findByRole('textbox');

    await userEvent.tab();
    await userEvent.type(input, 'Мо');

    expect(await screen.findByRole('listbox')).toBeInTheDocument();

    expect(renderOption.mock.calls[renderOption.mock.calls.length - 1][1]).toBe('Мо');

    await userEvent.type(input, 'с');
    expect(renderOption.mock.calls[renderOption.mock.calls.length - 1][1]).toBe('Мос');
  });

  it('uses url property if provided', async () => {
    const makeRequestMock = vi.spyOn(requestModule, 'makeRequest');

    render(<AddressSuggestions token="TEST_TOKEN" url="https://example.com/suggestions/api/4_1/rs/suggest/address" />);

    const input = await screen.findByRole('textbox');

    await userEvent.tab();
    await userEvent.type(input, 'Мос');

    expect(makeRequestMock.mock.calls[makeRequestMock.mock.calls.length - 1][1]).toBe(
      'https://example.com/suggestions/api/4_1/rs/suggest/address',
    );
  });

  it('respects selectOnBlur prop', async () => {
    const handleChangeMock = vi.fn();

    render(<AddressSuggestions token="TEST_TOKEN" onChange={handleChangeMock} selectOnBlur />);

    await userEvent.tab();

    const input = await screen.findByRole('textbox');
    await userEvent.type(input, 'Мо');

    const listBox = await screen.findByRole('listbox');
    expect(listBox).toBeInTheDocument();

    await userEvent.tab();

    expect(handleChangeMock.mock.calls.length).toBe(1);
    expect(handleChangeMock.mock.calls[0][0].value).toBe('г Москва');
  });

  it('uses uid prop', async () => {
    const { rerender } = render(<AddressSuggestions token="TEST_TOKEN" />);

    const combobox = await screen.findByRole('combobox');
    expect(combobox.getAttribute('aria-owns')).toBeTruthy();
    expect(combobox.getAttribute('aria-owns')).toEqual(combobox.getAttribute('aria-controls'));

    rerender(<AddressSuggestions token="TEST_TOKEN" uid="dadata-address-order-page" />);
    expect(combobox.getAttribute('aria-owns')).toBe('dadata-address-order-page');
    expect(combobox.getAttribute('aria-controls')).toBe('dadata-address-order-page');
  });
});
