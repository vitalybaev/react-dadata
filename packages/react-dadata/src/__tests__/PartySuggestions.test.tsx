import { getAllByRole, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { type SetupServerApi, setupServer } from 'msw/node';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PartySuggestions } from '../variants/party_russia/party-russia-suggestions';
import { partyMocks } from './mocks';

type RequestLog = {
  method: string;
  endpoint: string;
  data: Record<string, unknown>;
};

let server: SetupServerApi;
let requestCalls: RequestLog[] = [];

beforeEach(() => {
  requestCalls = [];

  server = setupServer(
    http.post<{ query: string }, Record<string, unknown>>(
      '*/suggestions/api/4_1/rs/suggest/party',
      async ({ request }) => {
        const data = await request.json();

        requestCalls.push({ method: request.method, endpoint: request.url.toString(), data });

        const { query } = data;

        if (query && typeof query === 'string') {
          return HttpResponse.json({ suggestions: partyMocks[query] });
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
    await userEvent.tab();

    await waitFor(() => {
      expect(requestCalls.length).toBe(1);
      expect(requestCalls.length).toBe(1);
      expect(requestCalls[0].data).toEqual({ query: '', count: 10 });
      expect(requestCalls[0].endpoint).toBe('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party');
    });

    await userEvent.type(input, 'Ск');

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

    await userEvent.tab();
    await userEvent.type(input, 'С');

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

    await userEvent.tab();

    expect(input).toHaveFocus();
    expect(handleFocusMock.mock.calls.length).toBe(1);

    await userEvent.type(input, 'ск');

    const listBox = await screen.findByRole('listbox');
    expect(listBox).toBeInTheDocument();
    expect(getAllByRole(listBox, 'option')).toHaveLength(7);
    await userEvent.click(screen.getByRole('option', { name: /ЖИЛЦЕНТР/i }));
    expect(input).toHaveFocus();
    expect(handleChangeMock).toHaveBeenCalledWith(partyMocks.ск[0]);
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
    await userEvent.tab();

    await waitFor(() => {
      expect(requestCalls.length).toBe(1);
      expect(requestCalls.length).toBe(1);
      expect(requestCalls[0].data.query).toBe('');
      expect(requestCalls[0].endpoint).toBe('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party');
    });

    await userEvent.type(input, 'ск');

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
