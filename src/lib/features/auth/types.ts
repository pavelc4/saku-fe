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
