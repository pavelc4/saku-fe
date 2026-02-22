import type { AppError } from '$lib/utils/result';

export type { AppError };

export function toAppError(e: unknown): AppError {
  if (e !== null && typeof e === 'object') {
    const obj = e as Record<string, unknown>;
    return {
      message: typeof obj['message'] === 'string' ? obj['message'] : 'Terjadi kesalahan.',
      code: typeof obj['code'] === 'string' ? obj['code'] : undefined,
      status: typeof obj['status'] === 'number' ? obj['status'] : undefined,
    };
  }
  return { message: 'Terjadi kesalahan yang tidak diketahui.' };
}
