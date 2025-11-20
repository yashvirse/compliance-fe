import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Login from './pages/login/Login.tsx';
import DashboardLayout from './layouts/DashboardLayout.tsx';
import DashboardHome from './pages/DashboardHome.tsx';
import FormPage from './pages/FormPage.tsx';
import UserPage from './pages/master/UserPage.tsx';
import CompanyPage from './pages/master/company/CompanyPage.tsx';
import AddCompanyPage from './pages/master/company/AddCompanyPage.tsx';
import CountryPage from './pages/master/country/CountryPage.tsx';
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="form" element={<FormPage />} />
              <Route path="components" element={<ComponentDemoPage />} />
              <Route path="master/user" element={<UserPage />} />
              <Route path="master/company" element={<CompanyPage />} />
              <Route path="master/company/add" element={<AddCompanyPage />} />
              <Route path="master/country" element={<CountryPage />} />
              <Route path="reports" element={<DashboardHome />} />
              <Route path="settings" element={<DashboardHome />} />
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
