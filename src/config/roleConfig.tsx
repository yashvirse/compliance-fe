import type { ReactNode } from 'react';

// User roles
export const UserRole = {
  SUPER_ADMIN: 'SuperAdmin',
  CUSTOMER_ADMIN: 'CustomerAdmin',
  MAKER: 'Maker',
  CHECKER: 'Checker',
  REVIEWER: 'Reviewer',
  AUDITOR: 'Auditor',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Menu item interface
export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: ReactNode;
  allowedRoles: UserRole[];
  children?: MenuItem[];
}

// Role-based menu configuration
export const menuConfig: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    allowedRoles: [
      UserRole.SUPER_ADMIN,
      UserRole.CUSTOMER_ADMIN,
      UserRole.MAKER,
      UserRole.CHECKER,
      UserRole.REVIEWER,
      UserRole.AUDITOR,
    ],
  },
  {
    id: 'master',
    label: 'Master',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.CUSTOMER_ADMIN, UserRole.MAKER],
    children: [
      {
        id: 'user',
        label: 'User',
        path: '/dashboard/master/user',
        allowedRoles: [UserRole.SUPER_ADMIN],
      },
      {
        id: 'customeradminuser',
        label: 'User Master',
        path: '/dashboard/master/customeradminuser',
        allowedRoles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        id: 'company',
        label: 'Company',
        path: '/dashboard/master/company',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.MAKER],
      },
      {
        id: 'department',
        label: 'Department Master',
        path: '/dashboard/master/department',
        allowedRoles: [UserRole.SUPER_ADMIN],
      },
      {
        id: 'act',
        label: 'Act Master',
        path: '/dashboard/master/act',
        allowedRoles: [UserRole.SUPER_ADMIN],
      },
      {
        id: 'activity',
        label: 'Activity Master',
        path: '/dashboard/master/activity',
        allowedRoles: [UserRole.SUPER_ADMIN],
      },
      {
        id: 'customeradminactivity',
        label: 'Activity Master',
        path: '/dashboard/master/customeradminactivity',
        allowedRoles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        id: 'country',
        label: 'Country',
        path: '/dashboard/master/country',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.CUSTOMER_ADMIN],
      },
    ],
  },
  {
    id: 'data-entry',
    label: 'Data Entry',
    allowedRoles: [UserRole.MAKER, UserRole.CHECKER],
    children: [
      {
        id: 'create-entry',
        label: 'Create Entry',
        path: '/dashboard/data-entry/create',
        allowedRoles: [UserRole.MAKER],
      },
      {
        id: 'pending-entries',
        label: 'Pending Entries',
        path: '/dashboard/data-entry/pending',
        allowedRoles: [UserRole.MAKER, UserRole.CHECKER],
      },
    ],
  },
  {
    id: 'verification',
    label: 'Verification',
    allowedRoles: [UserRole.CHECKER, UserRole.REVIEWER],
    children: [
      {
        id: 'check-entries',
        label: 'Check Entries',
        path: '/dashboard/verification/check',
        allowedRoles: [UserRole.CHECKER],
      },
      {
        id: 'review-entries',
        label: 'Review Entries',
        path: '/dashboard/verification/review',
        allowedRoles: [UserRole.REVIEWER],
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    allowedRoles: [
      UserRole.SUPER_ADMIN,
      UserRole.CUSTOMER_ADMIN,
      UserRole.REVIEWER,
      UserRole.AUDITOR,
    ],
    children: [
      {
        id: 'all-reports',
        label: 'All Reports',
        path: '/dashboard/reports/all',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.CUSTOMER_ADMIN],
      },
      {
        id: 'view-reports',
        label: 'View Reports',
        path: '/dashboard/reports/view',
        allowedRoles: [UserRole.REVIEWER, UserRole.AUDITOR],
      },
      {
        id: 'export-reports',
        label: 'Export Reports',
        path: '/dashboard/reports/export',
        allowedRoles: [UserRole.SUPER_ADMIN, UserRole.CUSTOMER_ADMIN, UserRole.REVIEWER],
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/dashboard/settings',
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.CUSTOMER_ADMIN],
  },
  {
    id: 'components',
    label: 'Components Demo',
    path: '/dashboard/components',
    allowedRoles: [UserRole.SUPER_ADMIN], // Demo page only for super admin
  },
];

// Helper function to filter menu items based on user role
export const getMenuItemsForRole = (role: UserRole, items: MenuItem[] = menuConfig): MenuItem[] => {
  return items
    .filter((item) => item.allowedRoles.includes(role))
    .map((item) => ({
      ...item,
      children: item.children ? getMenuItemsForRole(role, item.children) : undefined,
    }))
    .filter((item) => !item.children || item.children.length > 0); // Remove parent if no children visible
};

// Helper function to check if user has access to a specific route
export const hasAccessToRoute = (role: UserRole, path: string): boolean => {
  const checkAccess = (items: MenuItem[]): boolean => {
    for (const item of items) {
      if (item.path === path && item.allowedRoles.includes(role)) {
        return true;
      }
      if (item.children && checkAccess(item.children)) {
        return true;
      }
    }
    return false;
  };
  return checkAccess(menuConfig);
};

// Get dashboard path for role
export const getDashboardPathForRole = (role: UserRole): string => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return '/dashboard/super-admin';
    case UserRole.CUSTOMER_ADMIN:
      return '/dashboard/customer-admin';
    case UserRole.MAKER:
      return '/dashboard/maker';
    case UserRole.CHECKER:
      return '/dashboard/checker';
    case UserRole.REVIEWER:
      return '/dashboard/reviewer';
    case UserRole.AUDITOR:
      return '/dashboard/auditor';
    default:
      return '/dashboard';
  }
};
