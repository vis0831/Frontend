import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api', // This would be your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const tokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem('access_token');
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  },
  
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },
  
  clearTokens: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  
  isAuthenticated: (): boolean => {
    return !!tokenManager.getAccessToken();
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post('/api/token/refresh/', {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          tokenManager.setTokens(access, refreshToken);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          tokenManager.clearTokens();
          window.location.href = '/login';
        }
      } else {
        // No refresh token, redirect to login
        tokenManager.clearTokens();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Mock API responses for demonstration
const mockResponses = {
  login: {
    access: 'mock_access_token_' + Date.now(),
    refresh: 'mock_refresh_token_' + Date.now(),
    user: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      is_admin: false,
    }
  },
  
  signup: {
    message: 'User created successfully',
    user: {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      is_admin: false,
    }
  },
  
  profile: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    created_at: '2023-01-15T10:30:00Z',
    is_admin: false,
  },
  
  orders: [
    {
      id: 'ORD-001',
      status: 'delivered',
      total: 199.99,
      created_at: '2024-01-15T10:30:00Z',
      items: [
        { name: 'Premium Wireless Headphones', quantity: 1, price: 199.99 }
      ]
    },
    {
      id: 'ORD-002',
      status: 'processing',
      total: 89.98,
      created_at: '2024-01-10T14:20:00Z',
      items: [
        { name: 'Organic Cotton T-Shirt', quantity: 2, price: 29.99 },
        { name: 'Yoga Mat Premium', quantity: 1, price: 29.99 }
      ]
    }
  ],
  
  adminDashboard: {
    total_users: 1250,
    total_orders: 3847,
    total_revenue: 458920.50,
    orders_by_status: {
      pending: 45,
      processing: 120,
      shipped: 89,
      delivered: 3580,
      cancelled: 13
    }
  },
  
  adminOrders: [
    {
      id: 'ORD-001',
      user: 'john@example.com',
      status: 'delivered',
      total: 199.99,
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 'ORD-002',
      user: 'jane@example.com',
      status: 'processing',
      total: 89.98,
      created_at: '2024-01-10T14:20:00Z',
    }
  ]
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@example.com' && password === 'admin123') {
      return {
        ...mockResponses.login,
        user: { ...mockResponses.login.user, is_admin: true }
      };
    } else if (email === 'john@example.com' && password === 'password123') {
      return mockResponses.login;
    } else {
      throw new Error('Invalid credentials');
    }
  },
  
  signup: async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'existing@example.com') {
      throw new Error('Email already exists');
    }
    
    return mockResponses.signup;
  },
  
  refreshToken: async (refreshToken: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      access: 'new_mock_access_token_' + Date.now(),
    };
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockResponses.profile;
  },
  
  getOrders: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockResponses.orders;
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (currentPassword !== 'password123') {
      throw new Error('Current password is incorrect');
    }
    
    return { message: 'Password changed successfully' };
  }
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockResponses.adminDashboard;
  },
  
  getOrders: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockResponses.adminOrders;
  },
  
  updateOrderStatus: async (orderId: string, status: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return { message: 'Order status updated successfully' };
  }
};

export default api;