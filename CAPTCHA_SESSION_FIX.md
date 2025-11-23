# Captcha Session Problem - Solution

## Problem Description

**Issue:** Captcha validation works in Swagger but fails when called from React application.

- ✅ **Swagger**: Get captcha → Use in Authenticate → Works
- ❌ **React App**: Get captcha → Use in Authenticate → Fails

## Root Cause

The backend API uses **session-based captcha validation**. Here's how it works:

1. When you call `GET /Authenticate/get-captcha`, the server:
   - Generates a captcha string (e.g., "CDB40ZX")
   - Stores it in the **server-side session** associated with your request
   - Returns the captcha string to display to the user

2. When you call `POST /Authenticate` with the captcha code:
   - The server checks if the submitted captcha matches the one stored in **your session**
   - If sessions don't match → Validation fails

### Why it worked in Swagger:

Swagger UI runs in the **same browser** and automatically maintains the session through **cookies**. Both API calls share the same session.

### Why it failed in React:

By default, Axios **does NOT send cookies** with cross-origin requests. Each API call appeared to come from a different session to the server.

## Solution

Added `withCredentials: true` to the Axios configuration:

```typescript
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ← This enables session cookies
});
```

## What `withCredentials: true` Does

| Without `withCredentials` | With `withCredentials: true` |
|---------------------------|------------------------------|
| ❌ Cookies NOT sent | ✅ Cookies sent with requests |
| ❌ Session NOT maintained | ✅ Session maintained across requests |
| ❌ Each request = new session | ✅ All requests = same session |
| ❌ Captcha validation fails | ✅ Captcha validation works |

## How It Works Now

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 1. GET /Authenticate/get-captcha
                            │    withCredentials: true
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Server                          │
│  • Generates captcha: "ABC123"                              │
│  • Creates session: session-id-12345                        │
│  • Stores captcha in session                                │
│  • Returns: Set-Cookie: session-id-12345                    │
│  • Returns: { captcha: "ABC123" }                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Cookie stored in browser
                            │
                            │ 2. User enters captcha "ABC123"
                            │
                            │ 3. POST /Authenticate
                            │    withCredentials: true
                            │    Cookie: session-id-12345 (auto-sent)
                            │    Body: { userEmail, password, captchaCode: "ABC123" }
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Server                          │
│  • Receives session-id-12345 from cookie                    │
│  • Retrieves stored captcha from session                    │
│  • Compares: "ABC123" === "ABC123" ✅                       │
│  • Returns: Login successful                                │
└─────────────────────────────────────────────────────────────┘
```

## Backend Requirements

For `withCredentials: true` to work, the backend server must also be configured properly:

### Required CORS Headers:

```csharp
// In your .NET API Startup.cs or Program.cs
services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder
            .WithOrigins("http://localhost:5173") // Your React app URL
            .AllowCredentials() // ← IMPORTANT: Must allow credentials
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
```

### Response Headers Needed:

```
Access-Control-Allow-Origin: http://localhost:5173 (NOT *)
Access-Control-Allow-Credentials: true
```

**⚠️ Important:** When using `withCredentials: true`, the backend **CANNOT** use wildcard (`*`) for `Access-Control-Allow-Origin`. It must specify the exact origin.

## Testing the Fix

### 1. Clear Browser Cache/Cookies
```javascript
// In browser console
localStorage.clear();
// Then manually clear cookies for the API domain
```

### 2. Test Flow
```typescript
// Step 1: Fetch captcha (establishes session)
const captchaResponse = await apiService.get('Authenticate/get-captcha');
console.log('Captcha received:', captchaResponse.captcha);

// Step 2: Use same captcha in login (uses same session)
const loginResponse = await apiService.post('Authenticate', {
  userEmail: 'admin@gmail.com',
  password: 'your-password',
  captchaCode: captchaResponse.captcha
});
console.log('Login result:', loginResponse);
```

### 3. Verify in DevTools

**Network Tab:**
- Check the captcha request: Look for `Set-Cookie` in Response Headers
- Check the authenticate request: Look for `Cookie` in Request Headers
- Both should have the same session cookie

**Application Tab:**
- Go to Cookies → http://122.180.254.137:8099
- You should see the session cookie stored

## Common Issues & Solutions

### Issue 1: Still failing after adding `withCredentials`

**Check:** Backend CORS configuration
```csharp
// Make sure backend has:
.AllowCredentials()
.WithOrigins("http://localhost:5173") // NOT "*"
```

### Issue 2: CORS error in console

**Error:** 
```
Access to XMLHttpRequest has been blocked by CORS policy: 
The value of the 'Access-Control-Allow-Origin' header in the response 
must not be the wildcard '*' when the request's credentials mode is 'include'.
```

**Solution:** Backend must specify exact origin instead of `*`

### Issue 3: Cookie not being sent

**Check:** 
- Domain of cookie matches API domain
- Cookie is not `HttpOnly` (if you need to read it)
- Cookie `SameSite` attribute is set correctly (use `None` for cross-origin)

### Issue 4: Different ports/domains

If React app runs on `localhost:5173` and API on `122.180.254.137:8099`:

1. This is **cross-origin** → `withCredentials: true` required
2. Backend must whitelist `http://localhost:5173`
3. Cookies will work across different origins

## Alternative Approach: Token-Based Captcha

If session-based approach doesn't work, consider asking the backend team to implement **token-based captcha**:

```typescript
// 1. Get captcha API returns a token
GET /Authenticate/get-captcha
Response: {
  captcha: "ABC123",
  captchaToken: "unique-token-xyz" // ← Server generates this
}

// 2. Send token back with authenticate request
POST /Authenticate
Body: {
  userEmail: "...",
  password: "...",
  captchaCode: "ABC123",
  captchaToken: "unique-token-xyz" // ← Server validates using this
}
```

This approach doesn't rely on sessions and is more suitable for stateless APIs.

## Summary

✅ **Fixed by:** Adding `withCredentials: true` to Axios configuration
✅ **Why it works:** Enables cookie-based session management between React and API
✅ **Backend requirement:** Must allow credentials in CORS policy
✅ **Result:** Captcha validation now works the same way as in Swagger

## Files Modified

- `src/services/api.ts` - Added `withCredentials: true` to axios config
