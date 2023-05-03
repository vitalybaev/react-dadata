import React from 'react';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { cleanup, getAllByRole, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer, SetupServerApi } from 'msw/node';
import { rest } from 'msw';
import { PartySuggestions } from '../PartySuggestions';
import { partyMocks } from './mocks';

let server: SetupServerApi;
let requestCalls: any[] = [];

beforeEach(() => {
  requestCalls = [];

  server = setupServer(
    rest.post<{ query?: string }>('*/suggestions/api/4_1/rs/suggest/party', (req, res, ctx) => {
      requestCalls.push({ method: req.method, endpoint: req.url.toString(), data: req.body });

      const { query } = req.body;
      if (query && typeof query === 'string') {
        return res(ctx.json({ suggestions: partyMocks[query] }));
      }
      return res(ctx.json({ suggestions: [] }));
    }),
  );

  server.listen();
});

afterEach(() => {
  process.env.NODE_ENV = 'testing';
  cleanup();
  server.close();
});

describe('PartySuggestions', () => {
  it('PartySuggestions renders correctly', () => {
    render(<PartySuggestions token="TEST_TOKEN" />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('fetch 10 suggestions by default', async () => {
    render(<PartySuggestions token="TEST_TOKEN" />);

    const input = await screen.findByRole('textbox');
    userEvent.tab();

    await waitFor(() => {
      expect(requestCalls.length).toBe(1);
      expect(requestCalls.length).toBe(1);
      expect(requestCalls[0].data).toEqual({ query: '', count: 10 });
      expect(requestCalls[0].endpoint).toBe('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party');
    });

    userEvent.type(input, 'Ск');

    await waitFor(() => {
      expect(requestCalls.length).toBe(3);
      expect(requestCalls[2].data).toEqual({
        query: 'Ск',
        count: 10,
      });
    });
  });

  it("correctly fires input's onChange callback", async () => {
    const handleChangeMock = vi.fn();

    render(<PartySuggestions token="TEST_TOKEN" inputProps={{ onChange: handleChangeMock }} />);

    const input = await screen.findByRole('textbox');

    userEvent.tab();
    userEvent.type(input, 'С');

    expect(handleChangeMock).toBeCalledTimes(1);
    expect(handleChangeMock.mock.calls[0][0].target.value).toBe('С');
  });

  it('correctly types and selects suggestions', async () => {
    const handleFocusMock = vi.fn();
    const handleChangeMock = vi.fn();

    render(
      <PartySuggestions token="TEST_TOKEN" onChange={handleChangeMock} inputProps={{ onFocus: handleFocusMock }} />,
    );

    const input = await screen.findByRole('textbox');

    userEvent.tab();

    expect(input).toHaveFocus();
    expect(handleFocusMock.mock.calls.length).toBe(1);

    userEvent.type(input, 'ск');

    const listBox = await screen.findByRole('listbox');
    expect(listBox).toBeInTheDocument();
    expect(getAllByRole(listBox, 'option')).toHaveLength(7);
    userEvent.click(screen.getByRole('option', { name: /ЖИЛЦЕНТР/i }));
    expect(input).toHaveFocus();
    expect(handleChangeMock).toHaveBeenCalledWith(partyMocks['ск'][0]);
  });

  it('correctly sends http parameters', async () => {
    render(
      <PartySuggestions
        token="TEST_TOKEN"
        count={20}
        filterStatus={['LIQUIDATING', 'LIQUIDATED']}
        filterType="INDIVIDUAL"
        filterOkved={['07.1', '07.10', '07.2', '07.21']}
        filterLocations={[{ kladr_id: '65' }]}
        filterLocationsBoost={[{ kladr_id: '77' }]}
      />,
    );

    const input = await screen.findByRole('textbox');
    userEvent.tab();

    await waitFor(() => {
      expect(requestCalls.length).toBe(1);
      expect(requestCalls.length).toBe(1);
      expect(requestCalls[0].data.query).toBe('');
      expect(requestCalls[0].endpoint).toBe('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party');
    });

    userEvent.type(input, 'ск');

    await waitFor(() => {
      expect(requestCalls.length).toBe(3);
      expect(requestCalls[2].data).toEqual({
        query: 'ск',
        count: 20,
        status: ['LIQUIDATING', 'LIQUIDATED'],
        type: 'INDIVIDUAL',
        okved: ['07.1', '07.10', '07.2', '07.21'],
        locations: [{ kladr_id: '65' }],
        locations_boost: [{ kladr_id: '77' }],
      });
    });
  });
});
