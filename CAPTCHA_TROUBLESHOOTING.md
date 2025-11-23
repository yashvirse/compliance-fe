# Captcha Validation Troubleshooting Guide

## Current Issue: "Invalid Captcha" Error

The authentication API is returning:
```json
{
  "isSuccess": false,
  "message": "Invalid Captcha.",
  "result": null
}
```

## Debugging Steps

### Step 1: Check Console Logs

After the latest update, you'll see detailed logs in the browser console:

1. **Captcha Fetch:**
```
🔄 Fetching captcha...
✅ Captcha received: ABC123
📋 Check Network tab for Set-Cookie header in captcha response
```

2. **Login Attempt:**
```
🔐 Attempting login...
📝 Email: admin@gmail.com
🔢 Captcha Code: ABC123
📋 Check Network tab for Cookie header in authenticate request
```

### Step 2: Check Network Tab (Critical!)

#### For GET /Authenticate/get-captcha:

**Response Headers - Look for:**
```
Set-Cookie: ASP.NET_SessionId=xyz123; path=/; HttpOnly
```

**If Missing:** Backend is NOT setting session cookie ❌

#### For POST /Authenticate:

**Request Headers - Look for:**
```
Cookie: ASP.NET_SessionId=xyz123
```

**If Missing:** Browser is NOT sending session cookie ❌

### Step 3: Check Browser Cookies

1. Open DevTools → Application Tab → Cookies
2. Look for domain: `122.180.254.137:8099`
3. You should see: `ASP.NET_SessionId` or similar session cookie

**If Missing:** Session cookie is not being stored ❌

## Possible Root Causes & Solutions

### Issue 1: Backend Not Setting Session Cookie

**Symptom:** No `Set-Cookie` header in captcha response

**Cause:** Backend session configuration issue

**Backend Fix Needed (.NET):**

```csharp
// In Startup.cs or Program.cs

// 1. Enable Session
services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.None; // Required for cross-origin
    options.Cookie.SecurePolicy = CookieSecurePolicy.None; // Use SameAsRequest in production
});

// 2. Configure CORS BEFORE other middleware
services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder
            .WithOrigins("http://localhost:5173", "http://localhost:3000") // Your React URLs
            .AllowCredentials() // ← CRITICAL!
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// In Configure method (or app pipeline):
app.UseCors("AllowReactApp"); // Before UseSession
app.UseSession(); // Before UseAuthentication
app.UseAuthentication();
app.UseAuthorization();
```

**Captcha Controller Fix:**
```csharp
[HttpGet("get-captcha")]
public IActionResult GetCaptcha()
{
    var captchaCode = GenerateRandomCaptcha();
    
    // Store in session
    HttpContext.Session.SetString("CaptchaCode", captchaCode);
    
    return Ok(new { captcha = captchaCode });
}

[HttpPost]
public IActionResult Authenticate([FromBody] LoginRequest request)
{
    // Retrieve from session
    var sessionCaptcha = HttpContext.Session.GetString("CaptchaCode");
    
    if (string.IsNullOrEmpty(sessionCaptcha) || 
        !sessionCaptcha.Equals(request.CaptchaCode, StringComparison.OrdinalIgnoreCase))
    {
        return Ok(new { isSuccess = false, message = "Invalid Captcha.", result = (object)null });
    }
    
    // Clear captcha after validation
    HttpContext.Session.Remove("CaptchaCode");
    
    // Continue with authentication...
}
```

### Issue 2: CORS Blocking Credentials

**Symptom:** CORS error in console mentioning credentials

**Console Error:**
```
Access to XMLHttpRequest blocked by CORS policy: 
The value of 'Access-Control-Allow-Origin' must not be '*' 
when the request's credentials mode is 'include'.
```

**Backend Fix:**
```csharp
// DON'T USE:
.AllowAnyOrigin() // ❌ This sets origin to "*"

// MUST USE:
.WithOrigins("http://localhost:5173") // ✅ Specific origin
.AllowCredentials() // ✅ Allow credentials
```

### Issue 3: SameSite Cookie Attribute

**Symptom:** Cookie set but not sent with subsequent requests

**Backend Fix:**
```csharp
services.AddSession(options =>
{
    options.Cookie.SameSite = SameSiteMode.None; // For cross-origin
    options.Cookie.SecurePolicy = CookieSecurePolicy.None; // For HTTP (dev)
    // In production with HTTPS, use:
    // options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});
```

### Issue 4: Session Timeout Too Short

**Symptom:** Captcha works if you login immediately, fails if you wait

**Backend Fix:**
```csharp
services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(20); // Extend timeout
});
```

## Alternative: Token-Based Captcha (Recommended)

If session-based approach continues to fail, switch to token-based:

### Backend Changes:

```csharp
// In-memory cache for captcha tokens
private static ConcurrentDictionary<string, string> _captchaStore = new();

[HttpGet("get-captcha")]
public IActionResult GetCaptcha()
{
    var captchaCode = GenerateRandomCaptcha();
    var captchaToken = Guid.NewGuid().ToString(); // Unique token
    
    // Store with expiration
    _captchaStore.TryAdd(captchaToken, captchaCode);
    
    // Clean up after 5 minutes
    Task.Delay(TimeSpan.FromMinutes(5)).ContinueWith(_ => 
        _captchaStore.TryRemove(captchaToken, out _)
    );
    
    return Ok(new 
    { 
        captcha = captchaCode,
        captchaToken = captchaToken // ← Return this
    });
}

[HttpPost]
public IActionResult Authenticate([FromBody] LoginRequest request)
{
    // Validate using token
    if (!_captchaStore.TryRemove(request.CaptchaToken, out var storedCaptcha) ||
        !storedCaptcha.Equals(request.CaptchaCode, StringComparison.OrdinalIgnoreCase))
    {
        return Ok(new { isSuccess = false, message = "Invalid Captcha.", result = (object)null });
    }
    
    // Continue with authentication...
}
```

### Frontend Changes:

```typescript
// Update Login.Type.ts
export interface CaptchaResponse {
  captcha: string;
  captchaToken: string; // ← Add this
}

export interface LoginRequest {
  userEmail: string;
  password: string;
  captchaCode: string;
  captchaToken: string; // ← Add this
}

// Update Login.tsx
const [captchaToken, setCaptchaToken] = useState('');

const fetchCaptcha = async () => {
  const response = await apiService.get<CaptchaResponse>('Authenticate/get-captcha');
  setCaptchaImage(response.captcha);
  setCaptchaToken(response.captchaToken); // ← Store token
  setCaptchaInput('');
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const result = await dispatch(
    loginUser({
      userEmail: email,
      password: password,
      captchaCode: captchaInput,
      captchaToken: captchaToken, // ← Send token
    })
  );
};
```

## Quick Test: Use Exact Captcha from Swagger

To verify it's a session issue:

1. Open Swagger
2. Call GET /Authenticate/get-captcha
3. Get response: `{ "captcha": "ABC123" }`
4. **Immediately** in your React app, type "ABC123" in captcha field
5. Click Login

**If it fails:** It's definitely a session/cookie issue
**If it works:** Session is working, but timing out too quickly

## Check Backend Logs

Ask your backend team to add logging:

```csharp
[HttpPost]
public IActionResult Authenticate([FromBody] LoginRequest request)
{
    var sessionCaptcha = HttpContext.Session.GetString("CaptchaCode");
    
    // LOG THIS:
    _logger.LogInformation($"Session Captcha: {sessionCaptcha}, User Input: {request.CaptchaCode}");
    _logger.LogInformation($"Session ID: {HttpContext.Session.Id}");
    
    // This will show if session is maintained
}
```

## Final Checklist

- [ ] Browser console shows captcha received
- [ ] Network tab shows `Set-Cookie` in captcha response
- [ ] Network tab shows `Cookie` in authenticate request
- [ ] DevTools → Application → Cookies shows session cookie
- [ ] Backend has `AllowCredentials()` in CORS
- [ ] Backend has specific origin (not `*`)
- [ ] Frontend has `withCredentials: true` in axios
- [ ] Same domain/port for both API calls

## Contact Backend Team

If all frontend checks pass, the issue is backend configuration. Share this info:

```
We need to enable session-based captcha validation:

1. Add .AllowCredentials() to CORS policy
2. Change .AllowAnyOrigin() to .WithOrigins("http://localhost:5173")
3. Ensure session middleware is enabled with SameSite=None
4. Verify captcha is stored/retrieved from HttpContext.Session
5. Check session timeout is sufficient

OR

Switch to token-based captcha (recommended for stateless APIs)
```
