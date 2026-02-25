export type User = {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: 'user' | 'admin';
  is_verified: boolean;
  created_at: number;
};

export type SessionData = {
  user_id: string;
  role: 'user' | 'admin';
  email: string;
  device?: string;
  ip?: string;
  created_at: number;
  expires_at: number;
};

export type AuthResponse = {
  token: string;
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
