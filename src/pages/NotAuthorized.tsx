import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  BlockOutlined,
  ArrowBack,
  Home,
} from '@mui/icons-material';

const NotAuthorized: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.grey[50],
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              bgcolor: theme.palette.error.main,
              color: 'white',
              py: 4,
              textAlign: 'center',
            }}
          >
            <BlockOutlined sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h3" fontWeight={700}>
              403
            </Typography>
            <Typography variant="h6" fontWeight={500}>
              Access Denied
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 5, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Not Authorized
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mt: 2, mb: 4 }}>
              You don't have permission to access this page. This area is restricted to users
              with specific roles. Please contact your administrator if you believe this is an error.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 4,
                }}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<Home />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 4,
                  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                  '&:hover': {
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                  },
                }}
              >
                Go to Dashboard
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Need access? Contact your system administrator
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default NotAuthorized;
