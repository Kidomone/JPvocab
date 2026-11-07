import {
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from 'react';
import type { AuthUser, LoginPayload, RegisterPayload } from './types';
import { loginApi, registerApi, refreshTokenApi, logoutApi } from '../api/authApi';
import { authStorage } from './authStorage';
import { AuthContext } from './context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authStorage.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Silent session renewal
  useEffect(() => {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) return;
    refreshTokenApi(refreshToken)
      .then((response) => {
        authStorage.saveAuth(response);
        setUser(response.user);
      })
      .catch((err: any) => {
        if (err?.status === 401) {
          authStorage.clearAuth();
          setUser(null);
        } else {
          console.debug('Silent session renewal check postponed:', err);
        }
      });
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await loginApi(payload);
      authStorage.saveAuth(response);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await registerApi(payload);
      authStorage.saveAuth(response);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch (err) {
        console.warn('Server session revocation notice:', err);
      }
    }
    authStorage.clearAuth();
    setUser(null);
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) {
      logout();
      return false;
    }
    try {
      const response = await refreshTokenApi(refreshToken);
      authStorage.saveAuth(response);
      setUser(response.user);
      return true;
    } catch {
      // Rejection: token invalid, expired, or revoked
      logout();
      return false;
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user && authStorage.getAccessToken()),
        isLoading,
        login,
        register,
        refreshAccessToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
