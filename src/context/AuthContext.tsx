import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types/index';
import { UserRole } from '../config/roleConfig';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Map API role string to UserRole enum
        const roleMapping: Record<string, UserRole> = {
          'SuperAdmin': UserRole.SUPER_ADMIN,
          'CustomerAdmin': UserRole.CUSTOMER_ADMIN,
          'Maker': UserRole.MAKER,
          'Checker': UserRole.CHECKER,
          'Reviewer': UserRole.REVIEWER,
          'Viewer': UserRole.VIEWER,
        };
        parsedUser.role = roleMapping[parsedUser.role] || UserRole.VIEWER;
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, _password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Assign role based on email for demo purposes
    let role: UserRole = UserRole.VIEWER;
    if (email.includes('superadmin')) role = UserRole.SUPER_ADMIN;
    else if (email.includes('admin')) role = UserRole.CUSTOMER_ADMIN;
    else if (email.includes('maker')) role = UserRole.MAKER;
    else if (email.includes('checker')) role = UserRole.CHECKER;
    else if (email.includes('reviewer')) role = UserRole.REVIEWER;
    
    // Mock user data
    const userData: User = {
      id: '1',
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'User',
      email: email,
      role: role
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
