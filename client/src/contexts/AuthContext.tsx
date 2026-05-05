import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import apiClient, { initCsrf } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * On every mount (page load, refresh, new tab) call /auth/profile.
   * The browser sends the session cookie automatically (withCredentials).
   * - 200 → session is valid, populate user state
   * - 401 → not authenticated, user stays null
   * ProtectedRoute then decides whether to show the page or redirect to /login.
   */
  useEffect(() => {
    apiClient
      .get('/auth/profile')
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.data as User);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const logout = useCallback(async () => {
    try {
      // Refresh CSRF token before the logout POST so it never gets a 419
      await initCsrf();
      await apiClient.post('/auth/logout');
    } catch (err) {
      // Server error or already logged out — doesn't matter, clear client state anyway
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
