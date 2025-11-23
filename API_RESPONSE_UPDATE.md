# API Response Structure Update

## Overview
Updated the Redux login implementation to handle the actual API response structure from the authentication endpoint.

## Actual API Response

```json
{
  "isSuccess": true,
  "message": "Login Successful.",
  "result": {
    "id": "33262c33-b298-4598-a8c2-75182ea4e69b",
    "companyID": "00000000-0000-0000-0000-000000000000",
    "companyType": "Main",
    "name": "System Admin",
    "email": "admin@gmail.com",
    "role": "SuperAdmin",
    "domain": "ocmspro",
    "isActive": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Changes Made

### 1. Updated Type Definitions (`Login.Type.ts`)

```typescript
export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  result: UserData;
}

export interface UserData {
  id: string;
  companyID: string;
  companyType: string;
  name: string;
  email: string;
  role: UserRole | string;
  domain: string;
  isActive: boolean;
  token: string;
}
```

### 2. Updated Redux Slice (`Login.slice.ts`)

**Added Role Mapping Function:**
```typescript
const mapApiRoleToUserRole = (apiRole: string): UserRole => {
  const roleMapping: Record<string, UserRole> = {
    'SuperAdmin': UserRole.SUPER_ADMIN,
    'CustomerAdmin': UserRole.CUSTOMER_ADMIN,
    'Maker': UserRole.MAKER,
    'Checker': UserRole.CHECKER,
    'Reviewer': UserRole.REVIEWER,
    'Viewer': UserRole.VIEWER,
  };
  return roleMapping[apiRole] || UserRole.VIEWER;
};
```

**Updated API Call:**
```typescript
export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.post<LoginResponse>(
        'Authenticate',
        credentials
      );
      
      // Check if login was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Login failed');
      }
      
      // Store token and user data
      if (response.result?.token) {
        localStorage.setItem('authToken', response.result.token);
      }
      
      if (response.result) {
        localStorage.setItem('user', JSON.stringify(response.result));
      }
      
      return response;
    } catch (error: any) {
      // Error handling...
    }
  }
);
```

**Updated Fulfilled Case:**
```typescript
.addCase(loginUser.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;
  
  // Map the user data and convert role string to UserRole enum
  const userData = {
    ...action.payload.result,
    role: mapApiRoleToUserRole(action.payload.result.role),
  };
  
  state.user = userData;
  state.token = action.payload.result.token;
  state.isAuthenticated = true;
});
```

### 3. Updated User Interface (`types/index.ts`)

```typescript
export interface User {
  id: string;
  companyID: string;
  companyType: string;
  name: string;
  email: string;
  role: UserRole;
  domain: string;
  isActive: boolean;
  token: string;
}
```

### 4. Updated AuthContext (`AuthContext.tsx`)

**Added Role Mapping on Restore:**
```typescript
useEffect(() => {
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
```

**Updated Logout:**
```typescript
const logout = () => {
  setUser(null);
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
};
```

## Key Features

### ✅ Response Validation
- Checks `isSuccess` field from API
- Rejects if login was not successful

### ✅ Automatic Role Mapping
- Converts API role strings to `UserRole` enum
- Maintains type safety throughout the application
- Supports all 6 roles: SuperAdmin, CustomerAdmin, Maker, Checker, Reviewer, Viewer

### ✅ Enhanced User Data
- Stores complete user profile from API
- Includes companyID, companyType, domain, isActive flags
- Token stored both in Redux state and localStorage

### ✅ Error Handling
- Validates API response structure
- Provides meaningful error messages
- Auto-refreshes captcha on failed login

## Testing

### Test Credentials (based on API response)
```
Email: admin@gmail.com
Password: [your_password]
Expected Role: SuperAdmin → UserRole.SUPER_ADMIN
```

### Role Verification
After successful login, check:
1. Redux state has correct user data
2. Role is mapped to UserRole enum
3. Token is stored in localStorage as 'authToken'
4. User data is stored in localStorage as 'user'
5. Navigation redirects to appropriate role-based dashboard

## Migration Notes

If you have existing localStorage data from previous login implementation:
1. Clear localStorage: `localStorage.clear()`
2. Login again with valid credentials
3. New structure will be automatically stored

## API Role to Dashboard Mapping

| API Role | UserRole Enum | Dashboard Route |
|----------|---------------|-----------------|
| SuperAdmin | SUPER_ADMIN | /dashboard/super-admin |
| CustomerAdmin | CUSTOMER_ADMIN | /dashboard/customer-admin |
| Maker | MAKER | /dashboard/maker |
| Checker | CHECKER | /dashboard/checker |
| Reviewer | REVIEWER | /dashboard/reviewer |
| Viewer | VIEWER | /dashboard/viewer |
