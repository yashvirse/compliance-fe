# FormData Multipart/Form-Data Fix

## Problem
When updating a company using the `CompanyMaster/editComp` API with FormData, an "Unsupported Media Type" error was being returned. The payload was being sent as `application/json` instead of `multipart/form-data`.

## Root Causes

### 1. **Default Content-Type Header**
The axios instance in `api.ts` had a hardcoded `Content-Type: application/json` header:
```typescript
const apiClient: AxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",  // ❌ Forces JSON for all requests
  },
});
```

### 2. **PUT Method Doesn't Handle FormData Properly**
The `put()` method in ApiService didn't override the Content-Type header for FormData:
```typescript
async put<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  // ❌ Uses default "application/json" header, breaking FormData
  const response = await apiClient.put(url, data, config);
  return response.data;
}
```

### 3. **FormData with Wrong Content-Type**
When axios receives FormData with an explicitly set `Content-Type: application/json`, it serializes the FormData to a JSON string instead of properly formatting it as multipart data.

## Solution

### Added New API Methods
Two new methods were added to the `ApiService` class to properly handle FormData with PUT and PATCH requests:

#### `putFormData(url, formData, config)`
```typescript
async putFormData<T = any>(
  url: string,
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.put(url, formData, {
    ...config,
    headers: {
      "Content-Type": undefined,  // ✅ Let axios set it automatically
      ...config?.headers,
    },
  });
  return response.data;
}
```

#### `patchFormData(url, formData, config)`
```typescript
async patchFormData<T = any>(
  url: string,
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.patch(url, formData, {
    ...config,
    headers: {
      "Content-Type": undefined,  // ✅ Let axios set it automatically
      ...config?.headers,
    },
  });
  return response.data;
}
```

### Updated Company.Slice.ts
Changed the `updateCompany` thunk to use the new `putFormData` method:

```typescript
// Before ❌
const response = await apiService.put<UpdateCompanyResponse>(
  "CompanyMaster/editComp",
  formData
);

// After ✅
const response = await apiService.putFormData<UpdateCompanyResponse>(
  "CompanyMaster/editComp",
  formData
);
```

## How It Works

When `Content-Type: undefined` is set in axios headers:
1. Axios detects that the request body is a FormData instance
2. It automatically removes the `Content-Type` header from the default config
3. The browser automatically sets `Content-Type: multipart/form-data` with the correct boundary
4. The backend receives the request as proper multipart data

## Key Points

✅ **FormData Construction**: The FormData is correctly constructed with proper field names
✅ **Request Headers**: Content-Type is now correctly set to `multipart/form-data`
✅ **Axios Configuration**: No longer forces `application/json` for FormData requests
✅ **Browser Compatibility**: Relies on native browser behavior for FormData encoding

## Testing

When debugging, check the Network tab in browser DevTools:
- **Request Headers**: Should show `Content-Type: multipart/form-data; boundary=...`
- **Request Payload**: Should show form fields, not JSON
- **Response**: Should not return "415 Unsupported Media Type"

## Future Usage

When working with FormData for PUT/PATCH requests:
```typescript
const formData = new FormData();
formData.append("field", value);

// ✅ Use putFormData or patchFormData
const response = await apiService.putFormData(url, formData);

// ❌ Don't use regular put or post with FormData
// const response = await apiService.put(url, formData); // Wrong!
```

## Files Modified

- [src/services/api.ts](src/services/api.ts) - Added `putFormData()` and `patchFormData()` methods
- [src/pages/master/company/slice/Company.Slice.ts](src/pages/master/company/slice/Company.Slice.ts) - Updated `updateCompany` thunk to use `putFormData()`
