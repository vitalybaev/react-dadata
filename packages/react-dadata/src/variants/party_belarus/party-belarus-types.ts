import type { DaDataPartyType } from '../../types';
import type { DaDataPartyBelarusStatus } from '../../types';

type DaDataBelarusRequestFilterItem = { status: DaDataPartyBelarusStatus } | { type: DaDataPartyType };

export interface DaDataBelarusRequestPayload extends Record<string, unknown> {
  query: string;
  count: number;
  filters?: DaDataBelarusRequestFilterItem[];
}
