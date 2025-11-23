import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
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
import ComponentDemoPage from './pages/ComponentDemoPage.tsx';

import { UserRole } from './config/roleConfig.tsx';

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
                path="master/country" 
                element={
                  <RoleBasedRoute path="/dashboard/master/country">
                    <CountryPage />
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
            
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
