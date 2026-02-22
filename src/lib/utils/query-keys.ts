export const queryKeys = {
  transactions: {
    all: ['transactions'] as const,
    list: (cursor?: string) => ['transactions', 'list', cursor] as const,
    summary: (period: string) => ['transactions', 'summary', period] as const,
    receipt: (id: string) => ['transactions', 'receipt', id] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  insights: {
    period: (periodType: string, periodKey: string, lang: string) =>
      ['insights', periodType, periodKey, lang] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
  },
} as const;
