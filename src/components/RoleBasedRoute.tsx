import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { selectUser, selectIsAuthenticated, selectIsInitializing } from '../pages/login/slice/Login.selector';
import { hasAccessToRoute, UserRole } from '../config/roleConfig.tsx';

interface RoleBasedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
  path?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles,
  path 
}) => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitializing = useSelector(selectIsInitializing);

  // Show loading while checking authentication status
  if (isInitializing) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // If not logged in, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role as UserRole;

  // Check if specific roles are required
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/not-authorized" replace />;
    }
  }

  // Check if user has access to the specific path
  if (path && !hasAccessToRoute(userRole, path)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;
