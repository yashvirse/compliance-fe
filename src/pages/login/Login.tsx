import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  DomainOutlined,
} from "@mui/icons-material";
import { loginUser, clearError } from "./slice/Login.Slice";
import { selectLoginLoading, selectLoginError } from "./slice/Login.selector";
import { getDashboardPathForRole, UserRole } from "../../config/roleConfig";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();

  // Redux selectors
  const loading = useSelector(selectLoginLoading);
  const loginError = useSelector(selectLoginError);

  // Local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [domain, setDomain] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Dispatch login action and wait for result
    const result = await dispatch(
      loginUser({
        userEmail: email,
        password: password,
        domain: domain,
      })
    );

    // Check if login was successful
    if (loginUser.fulfilled.match(result)) {
      // Get the user role from the result
      const userRole = result.payload.result.role;

      // Role mapping from API string to UserRole enum
      const roleMapping: Record<string, UserRole> = {
        SuperAdmin: UserRole.SUPER_ADMIN,
        CustomerAdmin: UserRole.CUSTOMER_ADMIN,
        Maker: UserRole.MAKER,
        Checker: UserRole.CHECKER,
        Reviewer: UserRole.REVIEWER,
        Auditor: UserRole.AUDITOR,
      };

      const mappedRole = roleMapping[userRole] || UserRole.AUDITOR;

      // Get the dashboard path for the role
      const dashboardPath = getDashboardPathForRole(mappedRole);

      // Navigate immediately after successful login
      navigate(dashboardPath, { replace: true });
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page or show dialog
    console.log("Forgot password clicked");
    // You can implement this later: navigate('/forgot-password');
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Left Side - Image */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Circles */}
        <Box
          sx={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            top: -100,
            right: -100,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            bottom: -50,
            left: -50,
          }}
        />

        {/* Content */}
        <Box
          sx={{
            zIndex: 1,
            textAlign: "center",
            color: "white",
            p: 4,
          }}
        >
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Orchidea
          </Typography>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Compliance Management
          </Typography>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            System
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.9, mt: 2, maxWidth: 500, mx: "auto" }}
          >
            Streamline your compliance processes with our comprehensive
            management system
          </Typography>

          {/* You can replace this with an actual image */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600"
              alt="Compliance"
              sx={{
                maxWidth: "80%",
                height: "auto",
                borderRadius: 4,
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 450 }}>
          {/* Logo/Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              fontWeight={700}
              color="primary"
              gutterBottom
            >
              OcmsPro
            </Typography>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Welcome Back!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to access your dashboard
            </Typography>
          </Box>

          {loginError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {loginError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Company Domain
              </Typography>
              <TextField
                fullWidth
                type="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
                placeholder="Enter your domain"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DomainOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
              <Button
                onClick={handleForgotPassword}
                sx={{
                  textTransform: "none",
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot Password?
              </Button>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 600,
                boxShadow: `0 4px 15px ${theme.palette.primary.main}40`,
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Demo credentials: any email and password
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
