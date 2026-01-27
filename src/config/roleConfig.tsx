import type { ReactNode } from "react";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GavelIcon from "@mui/icons-material/Gavel";
import BuildIcon from "@mui/icons-material/Build";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArticleIcon from "@mui/icons-material/Article";
import ApiIcon from "@mui/icons-material/Api";

// User roles
export const UserRole = {
  SUPER_ADMIN: "SuperAdmin",
  CUSTOMER_ADMIN: "CustomerAdmin",
  MAKER: "Maker",
  CHECKER: "Checker",
  REVIEWER: "Reviewer",
  AUDITOR: "Auditor",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

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
    id: "dashboard",
    label: "Dashboard",
    // No path here - will be dynamically set based on role
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
    id: "master",
    label: "Master",
    icon: <AdminPanelSettingsIcon />,
    allowedRoles: [
      UserRole.SUPER_ADMIN,
      UserRole.CUSTOMER_ADMIN,
      UserRole.MAKER,
    ],
    children: [
      {
        id: "user",
        label: "User",
        path: "/dashboard/master/user",
        allowedRoles: [UserRole.SUPER_ADMIN],
      },
      {
        id: "customeradminuser",
        label: "User Master",
        path: "/dashboard/master/customeradminuser",
        icon: <PeopleIcon />,
        allowedRoles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        id: "company",
        label: "Company",
        path: "/dashboard/master/company",
        allowedRoles: [UserRole.SUPER_ADMIN],
      },
      {
        id: "department",
        label: "Department Master",
        path: "/dashboard/master/department",
        icon: <AccountTreeIcon />,
        allowedRoles: [UserRole.SUPER_ADMIN],
      },
      {
        id: "act",
        label: "Act Master",
        path: "/dashboard/master/act",
        icon: <GavelIcon />,
        allowedRoles: [UserRole.SUPER_ADMIN],
      },
      {
        id: "activity",
        label: "Activity Master",
        path: "/dashboard/master/activity",
        icon: <FactCheckIcon />,
        allowedRoles: [UserRole.SUPER_ADMIN],
      },
      {
        id: "site",
        label: "Site Master",
        path: "/dashboard/master/site",
        icon: <LocationOnIcon />,
        allowedRoles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        id: "customeradminactivity",
        label: "Activity Master",
        path: "/dashboard/master/customeradminactivity",
        icon: <FactCheckIcon />,
        allowedRoles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        id: "task",
        label: "Total Task",
        path: "/dashboard/master/task",
        icon: <AssignmentTurnedInIcon />,
        allowedRoles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        id: "country",
        label: "Country",
        path: "/dashboard/master/country",
        allowedRoles: [UserRole.SUPER_ADMIN],
      },
    ],
  },
  {
    id: "data-entry",
    label: "Data Entry",
    allowedRoles: [UserRole.MAKER, UserRole.CHECKER],
    children: [
      {
        id: "create-entry",
        label: "Create Entry",
        path: "/dashboard/data-entry/create",
        allowedRoles: [UserRole.MAKER],
      },
      {
        id: "pending-entries",
        label: "Pending Entries",
        path: "/dashboard/data-entry/pending",
        allowedRoles: [UserRole.MAKER, UserRole.CHECKER],
      },
    ],
  },
  {
    id: "verification",
    label: "Verification",
    allowedRoles: [UserRole.CHECKER, UserRole.REVIEWER],
    children: [
      {
        id: "check-entries",
        label: "Check Entries",
        path: "/dashboard/verification/check",
        allowedRoles: [UserRole.CHECKER],
      },
      {
        id: "review-entries",
        label: "Review Entries",
        path: "/dashboard/verification/review",
        allowedRoles: [UserRole.REVIEWER],
      },
    ],
  },
  // {
  //   id: "reports",
  //   label: "Reports",
  //   allowedRoles: [
  //     UserRole.SUPER_ADMIN,
  //     UserRole.CUSTOMER_ADMIN,
  //     UserRole.REVIEWER,
  //     UserRole.AUDITOR,
  //   ],
  //   children: [
  //     {
  //       id: "all-reports",
  //       label: "All Reports",
  //       path: "/dashboard/reports/all",
  //       allowedRoles: [UserRole.SUPER_ADMIN, UserRole.CUSTOMER_ADMIN],
  //     },
  //     {
  //       id: "view-reports",
  //       label: "View Reports",
  //       path: "/dashboard/reports/view",
  //       allowedRoles: [UserRole.REVIEWER, UserRole.AUDITOR],
  //     },
  //     {
  //       id: "export-reports",
  //       label: "Export Reports",
  //       path: "/dashboard/reports/export",
  //       allowedRoles: [
  //         UserRole.SUPER_ADMIN,
  //         UserRole.CUSTOMER_ADMIN,
  //         UserRole.REVIEWER,
  //       ],
  //     },
  //   ],
  // },
  {
    id: "tools",
    label: "Tools",
    icon: <BuildIcon />,
    allowedRoles: [UserRole.CUSTOMER_ADMIN],
    children: [
      {
        id: "file-explorer",
        label: "Data Repository",
        path: "/dashboard/tools/file-explorer",
        icon: <FolderOpenIcon />,
        allowedRoles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        id: "file-uploader",
        label: "File Uploader",
        path: "/dashboard/tools/file-uploader",
        icon: <CloudUploadIcon />,
        allowedRoles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        id: "template_formatter",
        label: "Template Formatter",
        path: "/dashboard/tools/template-formatter",
        icon: <ArticleIcon />,
        allowedRoles: [UserRole.CUSTOMER_ADMIN],
      },
      {
        id: "api-integration",
        label: "API Integration",
        path: "/dashboard/tools/api-integration",
        icon: <ApiIcon />,
        allowedRoles: [UserRole.CUSTOMER_ADMIN],
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    path: "/dashboard/settings",
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.CUSTOMER_ADMIN],
  },
  {
    id: "util",
    label: "Util",
    path: "/dashboard/util",
    icon: <CloudUploadIcon />,
    allowedRoles: [UserRole.SUPER_ADMIN],
  },
];

// Helper function to filter menu items based on user role
export const getMenuItemsForRole = (
  role: UserRole,
  items: MenuItem[] = menuConfig,
): MenuItem[] => {
  return items
    .filter((item) => item.allowedRoles.includes(role))
    .map((item) => ({
      ...item,
      children: item.children
        ? getMenuItemsForRole(role, item.children)
        : undefined,
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
      return "/dashboard/super-admin";
    case UserRole.CUSTOMER_ADMIN:
      return "/dashboard/customer-admin";
    case UserRole.MAKER:
      return "/dashboard/maker";
    case UserRole.CHECKER:
      return "/dashboard/checker";
    case UserRole.REVIEWER:
      return "/dashboard/reviewer";
    case UserRole.AUDITOR:
      return "/dashboard/auditor";
    default:
      return "/dashboard";
  }
};
