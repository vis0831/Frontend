import React, { createContext, useContext, useState, useEffect } from 'react';
import { tokenManager, authAPI } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && tokenManager.isAuthenticated();

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = () => {
      if (tokenManager.isAuthenticated()) {
        // In a real app, you'd fetch user profile here
        // For demo, we'll set a mock user
        setUser({
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          is_admin: false,
        });
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      // Store tokens
      tokenManager.setTokens(response.access, response.refresh);
      
      // Set user
      setUser(response.user);
      
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.signup(name, email, password);
      
      // Auto-login after signup
      await login(email, password);
      
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    tokenManager.clearTokens();
    setUser(null);
    window.location.href = '/';
  };

  const isAdmin = () => {
    return user?.is_admin || false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};