import type { Result } from '$lib/utils/result';
import type { PosSession, OpenSessionPayload, CloseSessionPayload } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

async function getActive(): Promise<Result<PosSession | null>> {
  try {
    const data = await api.get<PosSession | null>('/pos/session/active');
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function open(payload: OpenSessionPayload): Promise<Result<PosSession>> {
  try {
    const data = await api.post<PosSession>('/pos/session/open', payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function close(payload: CloseSessionPayload): Promise<Result<PosSession>> {
  try {
    const data = await api.post<PosSession>('/pos/session/close', payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const posSessionService = {
  getActive,
  open,
  close
};
