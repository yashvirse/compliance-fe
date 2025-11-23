# Redux Toolkit Login Implementation

## Overview

The login functionality has been implemented using Redux Toolkit with `createAsyncThunk` for API calls.

## File Structure

```
src/
├── app/
│   └── store.ts                    # Redux store configuration
├── pages/
│   └── login/
│       ├── Login.tsx               # Login component
│       └── slice/
│           ├── Login.Type.ts       # TypeScript interfaces
│           ├── Login.slice.ts      # Redux slice with async thunk
│           └── Login.selector.ts   # Selector functions
```

## API Configuration

### Endpoint
```
POST http://122.180.254.137:8099/api/Authenticate
```

### Request Body
```typescript
{
  "userEmail": "string",
  "password": "string",
  "captchaCode": "string"
}
```

### Response (Expected)
```typescript
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

## Usage in Components

### 1. Using the Login Thunk

```typescript
import { useDispatch } from 'react-redux';
import { loginUser } from './slice/Login.slice';
import type { AppDispatch } from '../../app/store';

const MyComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    const result = await dispatch(
      loginUser({
        userEmail: 'user@example.com',
        password: 'password123',
        captchaCode: 'ABC123',
      })
    );

    if (loginUser.fulfilled.match(result)) {
      console.log('Login successful:', result.payload);
    } else {
      console.log('Login failed:', result.payload);
    }
  };
};
```

### 2. Using Selectors

```typescript
import { useSelector } from 'react-redux';
import {
  selectLoginLoading,
  selectLoginError,
  selectUser,
  selectIsAuthenticated,
} from './slice/Login.selector';

const MyComponent = () => {
  const loading = useSelector(selectLoginLoading);
  const error = useSelector(selectLoginError);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {isAuthenticated && <p>Welcome, {user?.name}</p>}
    </div>
  );
};
```

### 3. Using Actions

```typescript
import { logout, clearError } from './slice/Login.slice';

// Logout
dispatch(logout());

// Clear error
dispatch(clearError());
```

## Redux State Structure

```typescript
{
  login: {
    loading: boolean,        // API call in progress
    error: string | null,    // Error message
    user: {                  // User information
      id: string,
      companyID: string,
      companyType: string,
      name: string,
      email: string,
      role: UserRole,        // Mapped to UserRole enum
      domain: string,
      isActive: boolean,
      token: string
    } | null,
    token: string | null,    // Auth token
    isAuthenticated: boolean // Authentication status
  }
}
```

## Role Mapping

The API returns role as a string (e.g., "SuperAdmin"), which is automatically mapped to the `UserRole` enum:

| API Role String | UserRole Enum |
|----------------|---------------|
| SuperAdmin | UserRole.SUPER_ADMIN |
| CustomerAdmin | UserRole.CUSTOMER_ADMIN |
| Maker | UserRole.MAKER |
| Checker | UserRole.CHECKER |
| Reviewer | UserRole.REVIEWER |
| Viewer | UserRole.VIEWER |

## Features

### ✅ Automatic Token Management
- Stores token in `localStorage` automatically
- Clears token on logout

### ✅ User Data Persistence
- Stores user data in `localStorage`
- Restores on app reload using `restoreUser` action

### ✅ Error Handling
- Catches API errors
- Provides user-friendly error messages
- Auto-refreshes captcha on failed login

### ✅ Loading States
- Loading indicator during API call
- Disabled submit button while loading

## Available Actions

### Async Actions
- `loginUser(credentials)` - Login API call

### Sync Actions
- `logout()` - Clear user session
- `clearError()` - Clear error message
- `restoreUser()` - Restore user from localStorage

## Selectors

- `selectLoginLoading` - Get loading state
- `selectLoginError` - Get error message
- `selectUser` - Get user data
- `selectToken` - Get auth token
- `selectIsAuthenticated` - Get authentication status
- `selectLoginState` - Get entire login state

## Captcha Flow

1. **On page load**: Fetch captcha from `Authenticate/get-captcha`
2. **User enters**: Email, password, and captcha code
3. **On submit**: All three values sent to `Authenticate` endpoint
4. **On error**: New captcha is automatically fetched

## Example: Complete Login Flow

```typescript
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from './slice/Login.slice';
import { selectLoginLoading, selectLoginError, selectIsAuthenticated } from './slice/Login.selector';
import { apiService } from '../../services/api';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  
  const loading = useSelector(selectLoginLoading);
  const error = useSelector(selectLoginError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Fetch captcha on mount
  useEffect(() => {
    fetchCaptcha();
  }, []);

  // Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const fetchCaptcha = async () => {
    const response = await apiService.get('Authenticate/get-captcha');
    setCaptchaText(response.captcha);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await dispatch(
      loginUser({
        userEmail: email,
        password: password,
        captchaCode: captcha,
      })
    );

    // Refresh captcha on error
    if (loginUser.rejected.match(result)) {
      fetchCaptcha();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      
      <div>Captcha: {captchaText}</div>
      <input value={captcha} onChange={(e) => setCaptcha(e.target.value)} />
      
      {error && <div>{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

## Notes

- Captcha validation is done in the Authenticate API, not separately
- Token is automatically stored in localStorage
- User data persists across page refreshes
- All API errors are handled gracefully
