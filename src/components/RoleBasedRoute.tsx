import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
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
  const { user } = useAuth();

  // If not logged in, redirect to login
  if (!user) {
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
