import { AuthUser } from './auth.model';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const authFeatureKey = 'auth';

const savedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('stock-platform-token') : null;
const savedUser = typeof localStorage !== 'undefined' ? localStorage.getItem('stock-platform-user') : null;

export const initialAuthState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) as AuthUser : null,
  token: savedToken,
  loading: false,
  error: null,
};
