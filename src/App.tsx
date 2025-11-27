import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from './app/store';
import { restoreUser } from './pages/login/slice/Login.Slice';
import { selectIsInitializing, selectIsAuthenticated, selectUser } from './pages/login/slice/Login.selector';
import { getDashboardPathForRole, UserRole } from './config/roleConfig.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import RoleBasedRoute from './components/RoleBasedRoute.tsx';
import Login from './pages/login/Login.tsx';
import DashboardLayout from './layouts/DashboardLayout.tsx';
import NotAuthorized from './pages/NotAuthorized.tsx';

// Role-specific dashboards
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard.tsx';
import CustomerAdminDashboard from './pages/dashboards/CustomerAdminDashboard.tsx';
import MakerDashboard from './pages/dashboards/MakerDashboard.tsx';
import CheckerDashboard from './pages/dashboards/CheckerDashboard.tsx';
import ReviewerDashboard from './pages/dashboards/ReviewerDashboard.tsx';
import ViewerDashboard from './pages/dashboards/ViewerDashboard.tsx';

// Pages
import FormPage from './pages/FormPage.tsx';
import UserPage from './pages/master/UserPage.tsx';
import CompanyPage from './pages/master/company/CompanyPage.tsx';
import AddCompanyPage from './pages/master/company/AddCompanyPage.tsx';
import CountryPage from './pages/master/country/CountryPage.tsx';
import ActMasterPage from './pages/master/act/ActMasterPage.tsx';
import AddActMasterPage from './pages/master/act/AddActMasterPage.tsx';
import DepartmentMasterPage from './pages/master/department/DepartmentMasterPage.tsx';
import AddDepartmentMasterPage from './pages/master/department/AddDepartmentMasterPage.tsx';
import ActivityMasterPage from './pages/master/activity/ActivityMasterPage.tsx';
import AddActivityMasterPage from './pages/master/activity/AddActivityMasterPage.tsx';
import CustomerAdminActivityMasterPage from './pages/master/customeradminactivity/CustomerAdminActivityMasterPage.tsx';
import ComponentDemoPage from './pages/ComponentDemoPage.tsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#42a5f5'
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8
  }
});

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitializing = useSelector(selectIsInitializing);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // Restore user session from localStorage on app load
  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  // Show loading screen while checking authentication
  if (isInitializing) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Role-specific dashboard routes */}
              <Route 
                path="super-admin" 
                element={
                  <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                    <SuperAdminDashboard />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="customer-admin" 
                element={
                  <RoleBasedRoute allowedRoles={[UserRole.CUSTOMER_ADMIN]}>
                    <CustomerAdminDashboard />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="maker" 
                element={
                  <RoleBasedRoute allowedRoles={[UserRole.MAKER]}>
                    <MakerDashboard />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="checker" 
                element={
                  <RoleBasedRoute allowedRoles={[UserRole.CHECKER]}>
                    <CheckerDashboard />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="reviewer" 
                element={
                  <RoleBasedRoute allowedRoles={[UserRole.REVIEWER]}>
                    <ReviewerDashboard />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="viewer" 
                element={
                  <RoleBasedRoute allowedRoles={[UserRole.VIEWER]}>
                    <ViewerDashboard />
                  </RoleBasedRoute>
                } 
              />

              {/* Generic dashboard redirect based on role */}
              <Route index element={<Navigate to="super-admin" replace />} />

              {/* Master routes */}
              <Route 
                path="master/user" 
                element={
                  <RoleBasedRoute path="/dashboard/master/user">
                    <UserPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/company" 
                element={
                  <RoleBasedRoute path="/dashboard/master/company">
                    <CompanyPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/company/add" 
                element={
                  <RoleBasedRoute path="/dashboard/master/company">
                    <AddCompanyPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/company/edit/:id" 
                element={
                  <RoleBasedRoute path="/dashboard/master/company">
                    <AddCompanyPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/country" 
                element={
                  <RoleBasedRoute path="/dashboard/master/country">
                    <CountryPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/act" 
                element={
                  <RoleBasedRoute path="/dashboard/master/act">
                    <ActMasterPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/act/add" 
                element={
                  <RoleBasedRoute path="/dashboard/master/act">
                    <AddActMasterPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/act/edit/:id" 
                element={
                  <RoleBasedRoute path="/dashboard/master/act">
                    <AddActMasterPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/department" 
                element={
                  <RoleBasedRoute path="/dashboard/master/department">
                    <DepartmentMasterPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/department/add" 
                element={
                  <RoleBasedRoute path="/dashboard/master/department">
                    <AddDepartmentMasterPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/department/edit/:id" 
                element={
                  <RoleBasedRoute path="/dashboard/master/department">
                    <AddDepartmentMasterPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/activity" 
                element={
                  <RoleBasedRoute path="/dashboard/master/activity">
                    <ActivityMasterPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/activity/add" 
                element={
                  <RoleBasedRoute path="/dashboard/master/activity">
                    <AddActivityMasterPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/activity/edit/:id" 
                element={
                  <RoleBasedRoute path="/dashboard/master/activity">
                    <AddActivityMasterPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="master/customeradminactivity" 
                element={
                  <RoleBasedRoute allowedRoles={[UserRole.CUSTOMER_ADMIN]}>
                    <CustomerAdminActivityMasterPage />
                  </RoleBasedRoute>
                } 
              />

              {/* Other routes */}
              <Route path="form" element={<FormPage />} />
              <Route 
                path="components" 
                element={
                  <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                    <ComponentDemoPage />
                  </RoleBasedRoute>
                } 
              />
              <Route path="reports" element={<SuperAdminDashboard />} />
              <Route 
                path="settings" 
                element={
                  <RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.CUSTOMER_ADMIN]}>
                    <SuperAdminDashboard />
                  </RoleBasedRoute>
                } 
              />
            </Route>
            
            <Route path="/" element={
              isAuthenticated && user ? (
                <Navigate to={getDashboardPathForRole(user.role as UserRole)} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
