import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Alert,
  Avatar,
  useTheme,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.tsx';
import { apiService } from '../../services/api';
import type { CaptchaResponse } from './slice/Login.Type.ts';



const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const CurrentUserRole = ""

  // Fetch captcha on component mount
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await apiService.get<CaptchaResponse>('/auth/captcha');
      setCaptchaImage(response.captchaImage);
      setCaptchaToken(response.captchaToken);
      setCaptchaInput('');
    } catch (err) {
      console.error('Failed to load captcha:', err);
      setError('Failed to load captcha. Please try again.');
    } finally {
      setCaptchaLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate captcha
    if (!captchaInput.trim()) {
      setError('Please enter the captcha code');
      return;
    }

    setLoading(true);

    try {
      // In real implementation, verify captcha with backend
      await apiService.post('/auth/verify-captcha', { 
        token: captchaToken, 
        captcha: captchaInput 
      });
      
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email, password, or captcha');
      // Refresh captcha on error
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.grey[100],
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={3}
          sx={{
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  mb: 2,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                <LockOutlined sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography
                component="h1"
                variant="h4"
                fontWeight={700}
                gutterBottom
                color="primary"
              >
                Welcome to OcmsPro
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Sign in to access your dashboard
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
                sx={{ mb: 3 }}
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
              />

              {/* Captcha Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Captcha Verification
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Paper
                    elevation={2}
                    sx={{
                      flex: 1,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: theme.palette.grey[100],
                      borderRadius: 2,
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    {captchaLoading ? (
                      <CircularProgress size={24} />
                    ) : captchaImage ? (
                      <img
                        src={captchaImage}
                        alt="Captcha"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Loading captcha...
                      </Typography>
                    )}
                  </Paper>
                  <IconButton
                    onClick={fetchCaptcha}
                    disabled={captchaLoading}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      },
                      '&:disabled': {
                        bgcolor: theme.palette.grey[300],
                      }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  label="Enter Captcha"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                  margin="normal"
                  placeholder="Enter the code shown above"
                  sx={{ mt: 2 }}
                />
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mt: 2,
                  mb: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Demo credentials: any email and password
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
