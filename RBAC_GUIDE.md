# Role-Based Access Control (RBAC) Implementation Guide

## Overview

This application implements a comprehensive role-based access control system with 6 distinct roles, each with specific permissions and dashboard views.

## User Roles

### 1. SuperAdmin
- **Email Pattern**: `superadmin@example.com`
- **Access Level**: Full system access
- **Dashboard**: Super Admin Dashboard
- **Permissions**:
  - All master data management (User, Company, Country)
  - All reports and analytics
  - System settings
  - Component demos
  - Full CRUD operations

### 2. CustomerAdmin
- **Email Pattern**: `admin@example.com`
- **Access Level**: Organization management
- **Dashboard**: Customer Admin Dashboard
- **Permissions**:
  - Company user management
  - Company and master data
  - Company-level reports
  - Organization settings

### 3. Maker
- **Email Pattern**: `maker@example.com`
- **Access Level**: Data entry
- **Dashboard**: Maker Dashboard
- **Permissions**:
  - Create new data entries
  - View pending entries
  - Company master data
  - Submit entries for checking

### 4. Checker
- **Email Pattern**: `checker@example.com`
- **Access Level**: Verification
- **Dashboard**: Checker Dashboard
- **Permissions**:
  - View entries created by makers
  - Approve or reject entries
  - Send entries for review
  - View pending entries

### 5. Reviewer
- **Email Pattern**: `reviewer@example.com`
- **Access Level**: Final review
- **Dashboard**: Reviewer Dashboard
- **Permissions**:
  - Review checked entries
  - Final approval authority
  - Access comprehensive reports
  - Export reports

### 6. Viewer
- **Email Pattern**: `viewer@example.com`
- **Access Level**: Read-only
- **Dashboard**: Viewer Dashboard
- **Permissions**:
  - View approved reports
  - Download reports
  - No editing capabilities

## Testing the Roles

### How to Test Different Roles

1. **Logout** from current session
2. Go to **Login** page
3. Enter email with role pattern (e.g., `superadmin@example.com`)
4. Enter any password (demo mode accepts all passwords)
5. Click **Sign In**

### What to Observe

1. **Left Sidebar Menu**
   - Each role sees only allowed menu items
   - Nested menus appear based on permissions
   - Menu structure adapts to user role

2. **Dashboard View**
   - Role-specific dashboard with relevant metrics
   - Different content for each role
   - Personalized statistics

3. **Route Protection**
   - Attempting to access unauthorized routes redirects to "Not Authorized" page
   - Direct URL navigation is also protected
   - Breadcrumb navigation reflects accessible paths

## Menu Structure by Role

### SuperAdmin Menu
```
├── Dashboard
├── Master
│   ├── User
│   ├── Company
│   └── Country
├── Data Entry
│   ├── Create Entry
│   └── Pending Entries
├── Verification
│   ├── Check Entries
│   └── Review Entries
├── Reports
│   ├── All Reports
│   ├── View Reports
│   └── Export Reports
├── Settings
└── Components Demo
```

### CustomerAdmin Menu
```
├── Dashboard
├── Master
│   ├── User
│   ├── Company
│   └── Country
└── Reports
    ├── All Reports
    └── Export Reports
```

### Maker Menu
```
├── Dashboard
├── Master
│   └── Company
└── Data Entry
    ├── Create Entry
    └── Pending Entries
```

### Checker Menu
```
├── Dashboard
├── Data Entry
│   └── Pending Entries
└── Verification
    └── Check Entries
```

### Reviewer Menu
```
├── Dashboard
├── Verification
│   └── Review Entries
└── Reports
    ├── View Reports
    └── Export Reports
```

### Viewer Menu
```
├── Dashboard
└── Reports
    └── View Reports
```

## Technical Implementation

### Key Components

1. **roleConfig.tsx** - Central configuration for roles and permissions
2. **RoleBasedSidebar.tsx** - Dynamic sidebar based on user role
3. **RoleBasedRoute.tsx** - Route protection component
4. **NotAuthorized.tsx** - 403 page for unauthorized access
5. **Role-specific Dashboards** - 6 separate dashboard components

### Role Assignment Logic

The demo uses email patterns to assign roles:
- Contains "superadmin" → SuperAdmin
- Contains "admin" → CustomerAdmin  
- Contains "maker" → Maker
- Contains "checker" → Checker
- Contains "reviewer" → Reviewer
- Default → Viewer

### Adding New Menu Items

Edit `src/config/roleConfig.tsx`:

```typescript
{
  id: 'new-menu',
  label: 'New Menu',
  path: '/dashboard/new-menu',
  allowedRoles: [UserRole.SUPER_ADMIN, UserRole.CUSTOMER_ADMIN],
}
```

### Adding New Routes

Edit `src/App.tsx`:

```typescript
<Route 
  path="new-menu" 
  element={
    <RoleBasedRoute path="/dashboard/new-menu">
      <NewMenuPage />
    </RoleBasedRoute>
  } 
/>
```

## Security Features

✅ Route-level protection
✅ Menu-level filtering
✅ Role-based redirects
✅ Authentication persistence
✅ Unauthorized access handling
✅ Type-safe role definitions

## Extending the System

### Adding a New Role

1. Add role to `roleConfig.tsx`:
   ```typescript
   export const UserRole = {
     ...existing roles,
     NEW_ROLE: 'NewRole',
   } as const;
   ```

2. Create dashboard component:
   ```typescript
   // src/pages/dashboards/NewRoleDashboard.tsx
   ```

3. Add to menu configuration with `allowedRoles`

4. Add route in `App.tsx`

5. Update login logic in `AuthContext.tsx`

### Customizing Permissions

Modify `allowedRoles` array in `roleConfig.tsx` for each menu item to control visibility and access.

## Best Practices

- Always use `RoleBasedRoute` wrapper for protected routes
- Keep role configuration centralized in `roleConfig.tsx`
- Use type-safe role constants
- Test with multiple roles during development
- Document role permissions clearly
