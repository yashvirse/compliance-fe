# Double API Call Bug Fix

## Issue
When clicking on certain dashboard cards (particularly "Total Tasks" in CustomerAdminDashboard), API endpoints were being called twice instead of once.

**Endpoint**: `Dashboard/getAssignedTask?fromDate`

## Root Cause
React 18's **StrictMode** in development mode intentionally double-renders components to help catch side effects. This caused the `useEffect` hooks to run twice on component mount, triggering duplicate API calls.

**In development** (with StrictMode):
1. Component mounts
2. useEffect runs
3. StrictMode cleans up and re-renders
4. useEffect runs again
5. Two identical API calls are made

**In production** (without StrictMode): Only one API call is made.

## Solution
Used a `useRef` to track whether the component has already been initialized. The `useEffect` now returns early if it has already run once, preventing the duplicate call.

```tsx
const initializationRef = useRef(false);

useEffect(() => {
  // Prevent double effect execution in StrictMode during development
  if (initializationRef.current) {
    return;
  }
  initializationRef.current = true;
  
  dispatch(fetchSuperAdminDashboard());
}, [dispatch]);
```

## Files Fixed
1. **CustomerAdminDashboard.tsx** - Lines 66-77 & 545-555
   - Added useRef to prevent double API calls on fetchAssignedTasks
   
2. **SuperAdminDashboard.tsx** - Lines 1, 33-43
   - Added useRef to prevent double API calls on fetchSuperAdminDashboard

## Alternative Approaches Considered
1. **Remove StrictMode**: Not recommended - StrictMode helps catch real bugs
2. **useEffect dependency tracking**: Not reliable in all scenarios
3. **AbortController**: Overkill for this use case; ref is cleaner

## Verification
- ✅ CustomerAdminDashboard builds without errors
- ✅ SuperAdminDashboard builds without errors
- ✅ Dev server running successfully at http://localhost:5174/
- ✅ No TypeScript compilation errors

## Impact
- **Production**: No impact (StrictMode only runs in development)
- **Development**: API calls now execute once instead of twice
- **Performance**: Improved by reducing redundant API calls during development testing
- **UX**: Faster feedback when testing features

## Testing
To verify the fix:
1. Open browser DevTools → Network tab
2. Navigate to CustomerAdminDashboard or SuperAdminDashboard
3. Click on any card with an onClick handler (e.g., "Total Tasks", "Pending Tasks")
4. Observe that API is called **only once** instead of twice

## Other Dashboards
Other dashboards (AuditorDashboard, CheckerDashboard, ReviewerDashboard, MakerDashboard) already have guard conditions in their useEffect hooks:
```tsx
useEffect(() => {
  if (user?.id) {  // Guard condition prevents double calls
    dispatch(fetchTaskCount(user.id));
  }
}, [dispatch, user?.id]);
```

These don't require the useRef fix.
