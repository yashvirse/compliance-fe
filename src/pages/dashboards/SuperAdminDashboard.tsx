import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  SupervisorAccount,
  Business,
  People,
  TrendingUp,
  Security,
} from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../app/hooks"; // path adjust kar lena

import { fetchSuperAdminDashboard } from "./superadminslice/SuperAdmin.slice";
import {
  selectSuperAdminDashboardData,
  selectSuperAdminError,
  selectSuperAdminLoading,
} from "./superadminslice/SuperAdmin.selector";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading = useAppSelector(selectSuperAdminLoading);
  const error = useAppSelector(selectSuperAdminError);
  const dashboardData = useAppSelector(selectSuperAdminDashboardData);
  
  // Prevent double API calls in StrictMode (React 18+ development)
  const initializationRef = useRef(false);

  useEffect(() => {
    // Prevent double effect execution in StrictMode during development
    if (initializationRef.current) {
      return;
    }
    initializationRef.current = true;
    
    dispatch(fetchSuperAdminDashboard());
  }, [dispatch]);

  // Yeh 4 cards jo aapko dikhane hain
  const stats = [
    {
      label: "Total Users",
      value: dashboardData?.totalUsers ?? 0,
      icon: <People />,
      color: theme.palette.primary.main,
      path: "/dashboard/master/user",
    },
    {
      label: "Total Companies",
      value: dashboardData?.totalCompany ?? 0,
      icon: <Business />,
      color: theme.palette.success.main,
      path: "/dashboard/master/company",
    },
    {
      label: "All Departments",
      value: dashboardData?.totalDepartment ?? 0,
      icon: <TrendingUp />,
      color: theme.palette.warning.main,
      path: "/dashboard/master/department",
    },
    {
      label: "All Act ",
      value: dashboardData?.totalAct ?? 0,
      icon: <Security />,
      color: theme.palette.info.main,
      path: "/dashboard/master/act",
    },
    {
      label: " All Activities",
      value: dashboardData?.totalActivity ?? 0,
      icon: <TrendingUp />,
      color: theme.palette.warning.main,
      path: "/dashboard/master/activity",
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Super Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete system overview and management
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              onClick={() => navigate(stat.path)}
              sx={{
                cursor: "pointer",
                borderRadius: 3,
                boxShadow: `0 4px 20px ${alpha(
                  theme.palette.common.black,
                  0.08
                )}`,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(stat.color, 0.1),
                      color: stat.color,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card
        sx={{
          mt: 3,
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <SupervisorAccount
              sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }}
            />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Super Admin Privileges
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Full system access and control
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" paragraph>
            As a Super Admin, you have complete access to all system features
            including user management, company administration, system settings,
            and comprehensive reporting.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Manage all users and roles
            <br />
            • Configure system-wide settings
            <br />
            • Access all reports and analytics
            <br />• Monitor system health and performance
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SuperAdminDashboard;
