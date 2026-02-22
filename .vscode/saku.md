# SAKU Frontend — SvelteKit

# PROMPT 1 — Project Scaffold

You are an expert SvelteKit developer. Scaffold a production-ready SvelteKit project for a financial management web app called SAKU, targeting Indonesian MSMEs (UMKM). The app connects to a Cloudflare Workers backend via REST API.

## Tech Stack
- SvelteKit (latest)
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn-svelte (New York style)
- TanStack Query v5 (@tanstack/svelte-query)
- Layercake (charts)
- Paraglide JS (i18n, implement last)
- Geist + Geist Mono (app font)
- Nunito Bold (branding font, logo and h1 only)

## Environment Variables
Create `.env.example`:
```
PUBLIC_API_URL=http://localhost:8787
```

Create `.env` (gitignored):
```
PUBLIC_API_URL=http://localhost:8787
```

## Architecture: Hybrid (shared layers outside, feature modules inside)

Generate the following folder structure with empty placeholder files and brief inline comments only where the purpose is non-obvious:

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/                   # shadcn-svelte base components (button, input, card, etc)
│   │   └── common/               # app-level reusable components
│   │       ├── Navbar.svelte
│   │       ├── Sidebar.svelte
│   │       ├── Modal.svelte
│   │       ├── Toast.svelte
│   │       ├── Skeleton.svelte
│   │       ├── EmptyState.svelte
│   │       ├── ErrorBoundary.svelte
│   │       └── AuthorizedImage.svelte  # fetches blob via authenticated request, creates objectURL
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/       # LoginForm, RegisterForm, OAuthButtons
│   │   │   ├── services/         # auth.service.ts
│   │   │   └── types.ts          # User, AuthResponse, LoginPayload, RegisterPayload
│   │   ├── transaction/
│   │   │   ├── components/       # TransactionList, TransactionCard, TransactionForm, ReceiptUpload
│   │   │   ├── services/         # transaction.service.ts
│   │   │   └── types.ts          # Transaction, TransactionItem, TransactionSummary, PaginatedTransaction
│   │   ├── category/
│   │   │   ├── components/       # CategoryList, CategoryBadge, CategoryForm
│   │   │   ├── services/         # category.service.ts
│   │   │   └── types.ts          # Category, CategoryType, CreateCategoryPayload
│   │   ├── budget/
│   │   │   ├── components/       # BudgetCard, BudgetProgress — UI only, no backend yet
│   │   │   ├── services/         # budget.service.ts — all functions return mock data, no API calls
│   │   │   └── types.ts          # Budget, BudgetProgress
│   │   ├── pos/
│   │   │   ├── components/       # ProductGrid, CartDrawer, CheckoutForm
│   │   │   ├── services/         # pos.service.ts — wraps transaction create with items[]
│   │   │   ├── stores/
│   │   │   │   └── cart.store.ts
│   │   │   └── types.ts          # CartItem, POSSession
│   │   └── insights/
│   │       ├── components/       # InsightCard, InsightSkeleton
│   │       ├── services/         # insights.service.ts
│   │       └── types.ts          # InsightResponse
│   ├── services/
│   │   ├── api.ts                # fetch-based HTTP client, token injection, 401 handler
│   │   └── query-client.ts       # TanStack Query client config
│   ├── stores/
│   │   ├── auth.store.ts         # global auth state (user, token)
│   │   └── theme.store.ts        # theme state (light/dark/system)
│   ├── utils/
│   │   ├── currency.ts           # formatRupiah, parseCurrency
│   │   ├── date.ts               # formatDate, formatRelative, timestampToDate
│   │   ├── error.ts              # toAppError, AppError type
│   │   ├── result.ts             # Go-style tuple: type Result<T> = [T | null, AppError | null]
│   │   ├── lang.ts               # detectLang from navigator.language -> 'id' | 'en'
│   │   ├── query-keys.ts         # centralized TanStack Query key factory
│   │   └── sanitize.ts           # sanitizeText — strip HTML tags from user input before display
│   └── types/
│       ├── api.ts                # ApiResponse<T>, PaginatedResponse<T> — matches BE contract exactly
│       └── common.ts             # shared enums, Period type ('today'|'week'|'month'|'year'), etc
├── routes/
│   ├── +layout.svelte            # root layout — QueryClientProvider, font setup, toast container
│   ├── +layout.ts                # load auth state on app init
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── +page.svelte
│   │   └── register/
│   │       └── +page.svelte
│   ├── oauth/
│   │   └── success/
│   │       └── +page.svelte      # handle OAuth redirect, extract token from query param
│   └── (app)/                    # protected routes — redirect to /login if no token
│       ├── +layout.svelte        # app shell — Sidebar + Navbar
│       ├── +layout.ts            # auth guard
│       ├── dashboard/
│       │   └── +page.svelte
│       ├── transactions/
│       │   └── +page.svelte
│       ├── categories/
│       │   └── +page.svelte
│       ├── pos/
│       │   └── +page.svelte
│       ├── budget/
│       │   └── +page.svelte      # placeholder — no backend, shows mock UI only
│       └── settings/
│           └── +page.svelte
└── app.css                       # Tailwind directives, CSS variables for theming
```

## Rules
- All files TypeScript strict
- routes/ is thin — no business logic, only imports from features/
- Business logic lives in features/<domain>/services/
- Shared utilities only in lib/utils/ and lib/types/
- No barrel index.ts exports (import directly from file path)
- Error handling uses Go-style tuple from lib/utils/result.ts
- No naked try/catch outside of api.ts boundary
- budget/ feature is placeholder UI only — no API calls, no real data
- Never import directly from a service inside +page.svelte — always compose via feature components

---

# PROMPT 2 — Design System

You are an expert SvelteKit + Tailwind CSS v4 developer. Set up the complete design system for SAKU — a financial management web app for Indonesian MSMEs.

## Runtime & Tooling
- Runtime: Bun
- Package manager: Bun (bun install, bun run dev, bun run build)
- SvelteKit + Vite
- Tailwind CSS v4
- shadcn-svelte (New York style)

## Typography
Install and configure two font families:

1. Geist Sans + Geist Mono — primary app font
   Source: @fontsource/geist, @fontsource/geist-mono

2. Nunito — branding/display font (Bold weight only, used for logo and h1 headings only)
   Source: @fontsource/nunito

Font config in app.css:
- --font-sans: Geist Sans
- --font-mono: Geist Mono
- --font-brand: Nunito

## Color Palette

Define these CSS custom properties in :root and .dark in app.css (Tailwind v4 @theme inline pattern):

### Base (Light)
```
--background: #FFFFFF
--foreground: #0A0A0A
--card: #F9F9F9
--card-foreground: #0A0A0A
--muted: #F4F4F5
--muted-foreground: #71717A
--border: #E4E4E7
--input: #E4E4E7
--ring: #18181B
```

### Primary (Brand)
```
--primary: #3B5BDB
--primary-foreground: #FFFFFF
```

### Semantic Colors
```
--income: #2F9E44
--income-foreground: #FFFFFF
--expense: #E03131
--expense-foreground: #FFFFFF
--warning: #F08C00
--warning-foreground: #FFFFFF
--success: #2F9E44
--destructive: #E03131
--destructive-foreground: #FFFFFF
```

### Dark Mode (.dark class on <html>)
```
--background: #0A0A0A
--foreground: #FAFAFA
--card: #111111
--card-foreground: #FAFAFA
--muted: #1C1C1C
--muted-foreground: #A1A1AA
--border: #27272A
--input: #27272A
--ring: #D4D4D8
--primary: #4C6EF5
--primary-foreground: #FFFFFF
```

## Border Radius
```
--radius: 0.625rem
```

## Spacing & Breakpoints (mobile-first)
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

## Dark Mode
- Strategy: class-based (.dark on <html>)
- Toggle: manual via settings, persisted in localStorage key saku_theme
- On app init: read localStorage before first paint (no flash — inline script in app.html <head>)
- Default: system preference via prefers-color-scheme

## app.html — anti-flash inline script
Add this inline script in <head> BEFORE any stylesheet:

```html
<script>
  (function () {
    try {
      var stored = localStorage.getItem('saku_theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    } catch (_) {}
  })();
</script>
```

## app.css structure
```css
@import 'tailwindcss';
@import '@fontsource/geist';
@import '@fontsource/geist-mono';
@import '@fontsource/nunito/700.css';

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-income: var(--income);
  --color-income-foreground: var(--income-foreground);
  --color-expense: var(--expense);
  --color-expense-foreground: var(--expense-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-success: var(--success);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-brand: var(--font-brand);
  --radius: var(--radius);
}

:root {
  --background: #FFFFFF;
  --foreground: #0A0A0A;
  --card: #F9F9F9;
  --card-foreground: #0A0A0A;
  --muted: #F4F4F5;
  --muted-foreground: #71717A;
  --border: #E4E4E7;
  --input: #E4E4E7;
  --ring: #18181B;
  --primary: #3B5BDB;
  --primary-foreground: #FFFFFF;
  --income: #2F9E44;
  --income-foreground: #FFFFFF;
  --expense: #E03131;
  --expense-foreground: #FFFFFF;
  --warning: #F08C00;
  --warning-foreground: #FFFFFF;
  --success: #2F9E44;
  --destructive: #E03131;
  --destructive-foreground: #FFFFFF;
  --radius: 0.625rem;
  --font-sans: 'Geist', sans-serif;
  --font-mono: 'Geist Mono', monospace;
  --font-brand: 'Nunito', sans-serif;
}

.dark {
  --background: #0A0A0A;
  --foreground: #FAFAFA;
  --card: #111111;
  --card-foreground: #FAFAFA;
  --muted: #1C1C1C;
  --muted-foreground: #A1A1AA;
  --border: #27272A;
  --input: #27272A;
  --ring: #D4D4D8;
  --primary: #4C6EF5;
  --primary-foreground: #FFFFFF;
}
```

## Theme Store (src/lib/stores/theme.store.ts)
Create a Svelte store that:
- Reads initial value from localStorage (saku_theme) or system prefers-color-scheme
- Applies/removes .dark class on <html> reactively
- Exposes: currentTheme, toggleTheme(), setTheme(theme: 'light' | 'dark' | 'system')
- Fully implemented — no placeholder functions

## Rules
- No hardcoded colors anywhere — always use CSS variables or Tailwind semantic tokens
- Dark mode must not flash on page load (use inline script in app.html <head>)
- All monetary values rendered in Rupiah format using lib/utils/currency.ts (formatRupiah)
- Income always styled with --income color, expense with --expense color
- Use Nunito Bold only for: app logo, h1 page titles
- Use Geist Sans for everything else

---

# PROMPT 3 — Authentication Pages

You are an expert SvelteKit developer. Build the authentication pages for SAKU using the established design system.

## Pages to build
1. /login — credential login + OAuth buttons
2. /register — registration form
3. /oauth/success — OAuth token handler

## Token Storage — SECURITY CRITICAL
The backend issues opaque session tokens (32-byte random hex), NOT JWTs.

Token storage strategy:
- Store token in memory (auth.store.ts writable) as primary
- Also write to sessionStorage key saku_token as fallback for page refresh
- NEVER store token in localStorage — XSS risk for financial app
- On app init (+layout.ts): read from sessionStorage if memory store is empty
- On logout: clear both memory store and sessionStorage

Rationale: sessionStorage is scoped to the browser tab and auto-cleared when tab closes.
This is a deliberate trade-off — user must re-login when opening a new tab.
For UMKM mobile use this is acceptable. Document this as a known UX trade-off.

## Auth Types (src/lib/features/auth/types.ts)

```typescript
export type User = {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: 'user' | 'admin';
  is_verified: boolean;
  created_at: number;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};
```

## Auth Store (src/lib/stores/auth.store.ts)

```typescript
import { writable, derived } from 'svelte/store';
import type { User } from '$lib/features/auth/types';

const _token = writable<string | null>(null);
const _user = writable<User | null>(null);

export const token = { subscribe: _token.subscribe };
export const user = { subscribe: _user.subscribe };
export const isAuthenticated = derived(_token, ($t) => $t !== null);

export function setAuth(newToken: string, newUser: User): void {
  _token.set(newToken);
  _user.set(newUser);
  try {
    sessionStorage.setItem('saku_token', newToken);
    sessionStorage.setItem('saku_user', JSON.stringify(newUser));
  } catch (_) {}
}

export function clearAuth(): void {
  _token.set(null);
  _user.set(null);
  try {
    sessionStorage.removeItem('saku_token');
    sessionStorage.removeItem('saku_user');
  } catch (_) {}
}

export function hydrateAuthFromSession(): void {
  try {
    const t = sessionStorage.getItem('saku_token');
    const u = sessionStorage.getItem('saku_user');
    if (t && u) {
      _token.set(t);
      _user.set(JSON.parse(u) as User);
    }
  } catch (_) {}
}
```

## Auth Service (src/lib/features/auth/services/auth.service.ts)

```typescript
import type { Result } from '$lib/utils/result';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

async function login(payload: LoginPayload): Promise<Result<AuthResponse>> {
  try {
    const data = await api.post<AuthResponse>('/auth/login', payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function register(payload: RegisterPayload): Promise<Result<void>> {
  try {
    await api.post<void>('/auth/register', payload);
    return [null, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function logout(): Promise<Result<void>> {
  try {
    await api.post<void>('/auth/logout', {});
    return [null, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function getMe(): Promise<Result<User>> {
  try {
    const data = await api.get<User>('/auth/me');
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const authService = { login, register, logout, getMe };
```

## Login Page (/login)
- Email + password fields with validation (required, email format)
- Submit calls authService.login()
- On success: setAuth(token, user) then goto('/dashboard')
- On error: show inline error using --destructive color, no alert()
- OAuth section: "Login with Google" and "Login with GitHub" buttons
  → window.location.href = `${PUBLIC_API_URL}/auth/google`
  → window.location.href = `${PUBLIC_API_URL}/auth/github`
- Link to /register
- Branding: SAKU logo (font-brand, Nunito Bold) centered at top
- Mobile-first, centered card on desktop (max-w-sm)
- Password field: show/hide toggle button
- Form disables and shows spinner on submit

## Register Page (/register)
- Name, email, password, confirm password fields
- Client-side validation: password min 8 chars, passwords must match
- Submit calls authService.register()
- On success: show "Cek email kamu untuk verifikasi akun" — do NOT auto-login
- On error: show inline error
- Link back to /login
- Password field: show/hide toggle

## OAuth Success Page (/oauth/success)
- onMount: extract ?token= and ?user= from URL search params
- Validate token is a non-empty string before calling setAuth
- If valid: setAuth(token, user) then goto('/dashboard')
- If missing or invalid: goto('/login')
- Show "Sedang masuk..." skeleton state while processing
- After processing: immediately replace history entry (history.replaceState) to remove token from URL

## Auth Guard (src/routes/(app)/+layout.ts)

```typescript
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { token, hydrateAuthFromSession } from '$lib/stores/auth.store';

export const load = () => {
  if (typeof window === 'undefined') return;
  hydrateAuthFromSession();
  if (!get(token)) {
    throw redirect(302, '/login');
  }
};
```

## (auth) Group Guard — redirect if already logged in
In src/routes/(auth)/+layout.ts:

```typescript
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { token, hydrateAuthFromSession } from '$lib/stores/auth.store';

export const load = () => {
  if (typeof window === 'undefined') return;
  hydrateAuthFromSession();
  if (get(token)) {
    throw redirect(302, '/dashboard');
  }
};
```

## Rules
- No naked try/catch in page components — use authService Result tuple
- All form submissions show loading state (disable button, spinner)
- Error messages use --destructive color token
- No alert() or console.log in production paths
- Forms are accessible: label htmlFor, aria-describedby for errors, aria-invalid on invalid fields
- NEVER store token in localStorage

---

# PROMPT 4 — API Client & Query Infrastructure

You are an expert SvelteKit + TanStack Query v5 developer. Set up the API client and query infrastructure for SAKU.

## API Client (src/lib/services/api.ts)

Use native fetch (not Axios) — leaner bundle for mobile-first UMKM users.

```typescript
import { env } from '$env/dynamic/public';
import { goto } from '$app/navigation';
import { clearAuth } from '$lib/stores/auth.store';
import { toAppError } from '$lib/utils/error';
import type { AppError } from '$lib/utils/error';

const BASE_URL = env.PUBLIC_API_URL;

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem('saku_token');
  } catch {
    return null;
  }
}

function buildHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers({ 'Content-Type': 'application/json', ...extra });
  const token = getToken();
  if (token) headers.set('Authorization', `Token ${token}`);
  return headers;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      clearAuth();
      goto('/login');
    }
    throw { message: 'Sesi habis. Silakan login kembali.', status: 401 } satisfies AppError;
  }

  const json = await res.json();

  if (!res.ok || json.success === false) {
    throw {
      message: json.message ?? 'Terjadi kesalahan.',
      code: json.error,
      status: res.status,
    } satisfies AppError;
  }

  return json.data as T;
}

async function uploadFile<T>(path: string, formData: FormData, signal?: AbortSignal): Promise<T> {
  const headers = new Headers();
  const token = getToken();
  if (token) headers.set('Authorization', `Token ${token}`);

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
    signal,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      clearAuth();
      goto('/login');
    }
    throw { message: 'Sesi habis. Silakan login kembali.', status: 401 } satisfies AppError;
  }

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw {
      message: json.message ?? 'Upload gagal.',
      code: json.error,
      status: res.status,
    } satisfies AppError;
  }

  return json.data as T;
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>('GET', path, undefined, signal),
  post: <T>(path: string, body: unknown, signal?: AbortSignal) => request<T>('POST', path, body, signal),
  put: <T>(path: string, body: unknown, signal?: AbortSignal) => request<T>('PUT', path, body, signal),
  patch: <T>(path: string, body: unknown, signal?: AbortSignal) => request<T>('PATCH', path, body, signal),
  delete: <T>(path: string, signal?: AbortSignal) => request<T>('DELETE', path, undefined, signal),
  upload: <T>(path: string, formData: FormData, signal?: AbortSignal) => uploadFile<T>(path, formData, signal),
};
```

## Query Client (src/lib/services/query-client.ts)

```typescript
import { QueryClient } from '@tanstack/svelte-query';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
```

## API Types (src/lib/types/api.ts)

```typescript
export type ApiResponse<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: string;
  message: string;
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: {
    next_cursor: string | null;
    has_more: boolean;
  };
};
```

## Common Types (src/lib/types/common.ts)

```typescript
export type Period = 'today' | 'week' | 'month' | 'year';
export type TransactionType = 'income' | 'expense';
export type CategoryType = 'income' | 'expense' | 'both';
export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type Lang = 'id' | 'en';
```

## Query Keys (src/lib/utils/query-keys.ts)

```typescript
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
```

## Result Utility (src/lib/utils/result.ts)

```typescript
export type AppError = {
  message: string;
  code?: string;
  status?: number;
};

export type Result<T> = [T, null] | [null, AppError];
```

## Error Utility (src/lib/utils/error.ts)

```typescript
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
```

## Sanitize Utility (src/lib/utils/sanitize.ts)

```typescript
// Strips HTML tags from user-supplied strings before rendering as text.
// Use this on any data that came from user input and is rendered in the DOM.
export function sanitizeText(raw: string): string {
  return raw.replace(/<[^>]*>/g, '').trim();
}
```

## Currency Utility (src/lib/utils/currency.ts)

```typescript
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseCurrency(formatted: string): number {
  const numeric = formatted.replace(/[^0-9]/g, '');
  return parseInt(numeric, 10) || 0;
}
```

## Date Utility (src/lib/utils/date.ts)

```typescript
export function formatDate(ts: number): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(ts));
}

export function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  return formatDate(ts);
}

export function timestampToDate(ts: number): Date {
  return new Date(ts);
}
```

## Lang Utility (src/lib/utils/lang.ts)

```typescript
import type { Lang } from '$lib/types/common';

export function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'id';
  return navigator.language.startsWith('id') ? 'id' : 'en';
}
```

## Root Layout (src/routes/+layout.svelte)
- Initialize QueryClient with createQueryClient()
- Wrap app in QueryClientProvider
- On mount: call hydrateAuthFromSession() then apply theme from theme.store
- Mount Toast container
- Fonts loaded via app.css imports (no runtime JS font loading)

## Root Layout Load (src/routes/+layout.ts)

```typescript
export const ssr = false;
```

Disable SSR globally — SAKU is a client-side SPA. All auth and data is client-side only.

## Rules
- Use native fetch, not Axios — smaller bundle for low-end mobile devices
- Authorization header format: `Token <opaque_token>` (NOT `Bearer`)
- Never call api directly from +page.svelte
- All queries use centralized queryKeys
- Categories staleTime should be overridden to Infinity at call site (rarely changes)
- AbortSignal passed to all api calls — components pass controller.signal to enable cancellation
- Never log tokens or user PII to console in any environment

---

# PROMPT 5 — Dashboard Page

You are an expert SvelteKit developer. Build the Dashboard page for SAKU financial app.

## Route: /dashboard

## Layout
Mobile-first grid:
- Mobile: single column stack
- Desktop (lg+): 2-column grid

## Sections

### 1. Summary Cards
Fetch from GET /transactions/summary?period=month

Display 4 cards:
- Total Income (--income color, arrow-up icon)
- Total Expense (--expense color, arrow-down icon)
- Net Balance (positive → --income, negative → --expense)
- Transaction Count

Each card: skeleton loading state while fetching.
All 4 summary cards fetched in one request (parallel via TanStack Query).

### 2. Period Selector
Tabs: Hari Ini | Minggu Ini | Bulan Ini | Tahun Ini
Maps to: today | week | month | year
Changing period refetches summary + chart.

### 3. Income vs Expense Chart (Layercake)
Bar chart — income vs expense side by side per category.
- X-axis: category names
- Y-axis: amount (formatRupiah on axis labels)
- Hover tooltip: category name + amount (formatRupiah)
- Responsive: full width mobile, constrained desktop
- Mobile: horizontally scrollable if categories > 5
- Use --income and --expense CSS variables for bar fill colors
- Skeleton loading state
- Empty state: illustration + "Belum ada transaksi"
- Lazy loaded via IntersectionObserver — only import Layercake when chart is in viewport

### 4. Recent Transactions
Fetch from GET /transactions?limit=5

Per item: category icon, description (sanitized via sanitizeText), amount, date (formatRelative)
- Amount: --income if income, --expense if expense
- Skeleton: 5 rows while loading
- "Lihat semua" link to /transactions
- Empty state if no transactions

### 5. AI Insights Card
Fetch from GET /insights?period_type=monthly&period_key=<YYYY-MM>&lang=<detected>

- period_key format: "2026-02" (current month)
- lang detected via detectLang() from lib/utils/lang.ts
- Card with lightbulb icon, --muted background
- Skeleton: 3 lines while loading
- Error state: "Insight tidak tersedia" + retry button (re-run query)
- Render insight text after passing through sanitizeText()

## TanStack Query Hooks (in features/transaction/services/)

```typescript
// useTransactionSummary.ts
import { createQuery } from '@tanstack/svelte-query';
import { queryKeys } from '$lib/utils/query-keys';
import { transactionService } from './transaction.service';
import type { Period } from '$lib/types/common';

export function useTransactionSummary(period: Period) {
  return createQuery({
    queryKey: queryKeys.transactions.summary(period),
    queryFn: ({ signal }) => transactionService.getSummary(period, signal),
  });
}
```

```typescript
// useRecentTransactions.ts
import { createQuery } from '@tanstack/svelte-query';
import { queryKeys } from '$lib/utils/query-keys';
import { transactionService } from './transaction.service';

export function useRecentTransactions() {
  return createQuery({
    queryKey: queryKeys.transactions.list(),
    queryFn: ({ signal }) => transactionService.getList({ limit: 5 }, signal),
  });
}
```

```typescript
// useInsight.ts — in features/insights/services/
import { createQuery } from '@tanstack/svelte-query';
import { queryKeys } from '$lib/utils/query-keys';
import { insightsService } from './insights.service';
import { detectLang } from '$lib/utils/lang';

export function useMonthlyInsight(month: number, year: number) {
  const periodKey = `${year}-${String(month).padStart(2, '0')}`;
  const lang = detectLang();
  return createQuery({
    queryKey: queryKeys.insights.period('monthly', periodKey, lang),
    queryFn: ({ signal }) => insightsService.get('monthly', periodKey, lang, signal),
    staleTime: 1000 * 60 * 60,
  });
}
```

## Rules
- No business logic in +page.svelte — compose via feature components only
- All amounts via formatRupiah
- All dates via formatRelative
- All user-supplied text via sanitizeText before render
- Error boundary per section — one section failing must not crash others
- Receipt images never loaded on dashboard

---

# PROMPT 6 — Transactions Page

You are an expert SvelteKit developer. Build the Transactions page for SAKU.

## Route: /transactions

## Features
1. Infinite scroll list (cursor-based pagination)
2. Create transaction (modal/drawer)
3. Edit transaction
4. Delete transaction (with confirmation)
5. Receipt upload per transaction
6. Receipt viewer (AuthorizedImage)

## Infinite Scroll
TanStack Query useInfiniteQuery:
- Endpoint: GET /transactions?cursor=<ulid>&limit=20
- Load more on scroll via IntersectionObserver on sentinel element
- nextPageParam = pagination.next_cursor (null if has_more = false)

## Transaction Form
Fields:
- Type: Income | Expense (segmented control)
- Category: dropdown from GET /categories filtered by type, staleTime Infinity
- Amount: number input, formatted with formatRupiah on blur, raw number on focus
- Date: date picker (default today, stored as Unix ms)
- Note: optional textarea, maxlength 500
- Items[]: optional expandable section for POS line items (name, qty, price)

On submit (create):
- POST /transactions with body matching backend schema
- Optimistic: add placeholder item with temporary id to list
- On success: invalidate queryKeys.transactions.all
- On error: revert optimistic update + show toast error

On submit (edit):
- PATCH /transactions/:id
- Pre-fill form with existing values
- On success: invalidate queryKeys.transactions.all

## Delete
- DELETE /transactions/:id
- Confirmation dialog before deleting
- Optimistic: remove from list immediately
- On error: revert + toast

## Receipt Upload
- POST /transactions/:id/receipt using api.upload() (multipart/form-data)
- Trigger: paperclip icon on TransactionCard
- Validate client-side: max 5MB, accept image/jpeg image/png image/webp application/pdf
- Show upload progress via XHR or ReadableStream
- On success: show thumbnail via AuthorizedImage

## AuthorizedImage Component (src/lib/components/common/AuthorizedImage.svelte)

```typescript
// Fetches a protected resource and renders it as an image using a blob objectURL.
// The Authorization header is injected automatically.
// objectURL is revoked on component destroy to prevent memory leaks.
import { onDestroy, onMount } from 'svelte';
import { api } from '$lib/services/api';

export let path: string;
export let alt: string = '';
export let class_: string = '';

let src: string | null = null;
let error = false;

onMount(async () => {
  try {
    const token = sessionStorage.getItem('saku_token');
    const res = await fetch(`${import.meta.env.PUBLIC_API_URL}${path}`, {
      headers: token ? { Authorization: `Token ${token}` } : {},
    });
    if (!res.ok) { error = true; return; }
    const blob = await res.blob();
    src = URL.createObjectURL(blob);
  } catch {
    error = true;
  }
});

onDestroy(() => {
  if (src) URL.revokeObjectURL(src);
});
```

## TransactionCard Component
- Category icon + color badge
- Description (sanitized via sanitizeText, truncated to 1 line, expand on tap)
- Amount (--income or --expense colored, formatRupiah)
- Date (formatRelative)
- Receipt indicator if receipt_url exists
- Mobile: long press / swipe reveals edit + delete actions (min touch target 44px)
- Desktop: hover shows action buttons

## Input Validation (client-side, before submit)
- Amount: must be positive integer, max 999_999_999_999 (prevent overflow)
- Description: required, min 1 char, max 255 chars, sanitized
- Note: optional, max 500 chars
- Date: must be valid date, not in the future by more than 1 day
- Category: required, must be from the fetched list (no free-text injection)

## Rules
- Virtual rendering for performance: only render visible cards + buffer
- Cursor pagination only — never offset
- All mutations invalidate relevant query keys
- All user text rendered after sanitizeText
- Receipt file validated client-side before upload (size + MIME type)

---

# PROMPT 7 — POS Mode

You are an expert SvelteKit developer. Build the POS (Point of Sale) mode for SAKU.

## Route: /pos

## Cart Store (src/lib/features/pos/stores/cart.store.ts)

```typescript
import { writable, derived } from 'svelte/store';
import type { CartItem } from '../types';

const _items = writable<CartItem[]>([]);

export const items = { subscribe: _items.subscribe };

export const totalAmount = derived(_items, ($items) =>
  $items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

export function addItem(item: CartItem): void {
  _items.update((current) => {
    const existing = current.findIndex(
      (i) => i.product_id !== undefined && i.product_id === item.product_id
    );
    if (existing !== -1) {
      return current.map((i, idx) =>
        idx === existing ? { ...i, quantity: i.quantity + 1 } : i
      );
    }
    return [...current, { ...item, quantity: 1 }];
  });
}

export function removeItem(index: number): void {
  _items.update((current) => current.filter((_, i) => i !== index));
}

export function updateQuantity(index: number, qty: number): void {
  if (qty <= 0) {
    removeItem(index);
    return;
  }
  _items.update((current) =>
    current.map((item, i) => (i === index ? { ...item, quantity: qty } : item))
  );
}

export function clearCart(): void {
  _items.set([]);
}
```

## POS Types (src/lib/features/pos/types.ts)

```typescript
export type CartItem = {
  name: string;
  quantity: number;
  price: number;
  product_id?: string;
};
```

## Layout
Mobile-first:
- Mobile: product grid top, cart drawer bottom (sticky)
- Desktop: left panel (product grid) + right panel (cart)

## Product Grid
- Manual entry card: input name + price → addItem to cart
  - Validate: name required, price must be positive integer
- Recent items: derived from cached transaction list (last 20 unique item name+price pairs)
- Tap → addItem with qty 1
- Long press → input custom quantity

## Cart Panel
- List CartItem with +/- quantity controls
- Swipe to remove (mobile)
- Total amount (formatRupiah, font-brand Nunito Bold)
- Category selector (required before checkout)
- Note field (optional, max 255 chars)
- "Catat Transaksi" button — disabled if cart is empty or no category selected

## Checkout
On submit:
```typescript
// POST /transactions
{
  type: 'expense',
  category_id: selectedCategoryId,
  amount: get(totalAmount),
  description: 'POS Transaction',
  date: Date.now(),
  note: note || null,
  items: get(items).map((item) => ({
    name: sanitizeText(item.name),
    price: item.price,
    quantity: item.quantity,
  }))
}
```
- Optimistic: show success animation immediately, clearCart()
- On success: invalidate queryKeys.transactions.all + show toast
- On error: restore cart state + toast error

## Input Validation
- Item name: required, max 100 chars, sanitized
- Item price: must be positive integer, max 999_999_999
- Quantity: must be positive integer, max 9999
- Category: required — cannot submit without selecting one

## Rules
- Cart is in-memory only — no localStorage, no persistence
- Touch targets min 44px
- Optimistic update is key — feel instant
- Error recovery explicit — user sees what failed and can retry
- All item names rendered via sanitizeText

---

# PROMPT 8 — Settings Page

You are an expert SvelteKit developer. Build the Settings page for SAKU.

## Route: /settings

## Sections

### Profile
- Display current user: name, email, avatar
- Edit name: inline edit (click pencil icon → input appears)
- Avatar: input avatar_url (external URL only)
  - Validate URL format before saving
  - Preview avatar before saving
- PATCH /users/me on save
- Success/error via Toast

### Appearance
- Theme toggle: Light | Dark | System (3-way)
- Uses theme.store.ts setTheme()
- Visual indicator of current active theme
- Persists to localStorage key: saku_theme

### Language (placeholder)
- Dropdown: Bahasa Indonesia | English
- Persists to localStorage key: saku_lang
- Note: "Pengaturan bahasa aktif setelah reload"
- Does not call any API

### Account
- Logout button
- Calls authService.logout() → POST /auth/logout
- Regardless of logout API result: always call clearAuth() then goto('/login')
  (network failure must not trap user in app)
- Styled with --destructive color

### Danger Zone
- "Hapus Akun" button — disabled, tooltip "Segera hadir"
- Destructive styling but clearly disabled state

## Rules
- Each section is a separate card component
- All mutations: disable form + show spinner while in-flight
- Never block logout on network failure — always clear local auth state
- Settings page has no heavy data fetching (user already in auth.store)
- All user input (name, avatar_url) sanitized before sending to API
- Avatar URL: validate is http:// or https:// before accepting

---

# SECURITY SUMMARY

| Concern | Mitigation |
|---|---|
| XSS via user input | sanitizeText() on all user-supplied strings before DOM render |
| Token theft via XSS | Token in sessionStorage (not localStorage), cleared on tab close |
| Token in URL | OAuth success page clears token from URL via history.replaceState immediately |
| Unauthorized access | Auth guard on all (app) routes, redirect to /login if no token |
| Already-authed redirect | (auth) group redirects to /dashboard if token exists |
| 401 handling | api.ts centrally clears auth + redirects — no stale sessions |
| File upload abuse | Client-side MIME + size validation before upload (5MB, allowed types) |
| Input overflow | Max lengths enforced on all form fields client-side |
| Amount overflow | Amount capped at 999_999_999_999 client-side |
| Logout trap | clearAuth() always runs regardless of logout API success/failure |
| PII in console | No console.log of tokens or user data anywhere |
| Fetch cancellation | AbortSignal passed through api calls — prevents stale responses |

---

# KNOWN TRADE-OFFS

| Trade-off | Reason |
|---|---|
| sessionStorage (not localStorage) for token | Cleared on tab close — user re-logins per tab. Acceptable for UMKM mobile single-tab use. |
| Native fetch over Axios | ~14KB bundle saving — meaningful on entry-level Android devices on 3G |
| No SSR (ssr = false) | All auth is client-side only. No server-side session validation. Acceptable for SPA. |
| Budget feature UI-only | Backend not implemented yet. Clearly marked as placeholder in code and comments. |
| Receipt upload through Worker | Max 5MB direct upload. If timeouts occur, migrate to R2 presigned URL. |
