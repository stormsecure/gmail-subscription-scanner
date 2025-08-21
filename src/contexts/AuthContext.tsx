import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const CLIENT_ID = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || '1022221045089-p375ut977lnafl041u0kd5056kmvirmd.apps.googleusercontent.com';
  const REDIRECT_URI = window.location.origin + '/gmail-subscription-scanner/auth/callback';
  const SCOPE = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

  useEffect(() => {
    // Check if user is already authenticated
    const storedToken = localStorage.getItem('gmail_access_token');
    const storedUser = localStorage.getItem('gmail_user');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('gmail_access_token');
        localStorage.removeItem('gmail_user');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (): Promise<void> => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(SCOPE)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.location.href = authUrl;
  };

  const handleCallback = async (code: string): Promise<void> => {
    console.log('Handling OAuth callback with code:', code);
    try {
      setIsLoading(true);

      // For demo purposes, simulate successful authentication
      const demoUser: User = {
        id: 'demo-user',
        email: 'demo@example.com',
        name: 'Demo User',
        picture: 'https://via.placeholder.com/40'
      };

      const demoToken = 'demo-access-token';

      localStorage.setItem('gmail_access_token', demoToken);
      localStorage.setItem('gmail_user', JSON.stringify(demoUser));

      setUser(demoUser);
      setToken(demoToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication error:', error);
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = (): void => {
    localStorage.removeItem('gmail_access_token');
    localStorage.removeItem('gmail_user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    token: token || undefined,
    signIn,
    signOut,
    handleCallback,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}