import React from 'react';
import { Box, Typography, Card, CardContent, Grid, useTheme, alpha } from '@mui/material';
import { Business, People, Assessment, Settings } from '@mui/icons-material';

const CustomerAdminDashboard: React.FC = () => {
  const theme = useTheme();

  const stats = [
    { label: 'Company Users', value: '124', icon: <People />, color: theme.palette.primary.main },
    { label: 'Active Projects', value: '18', icon: <Business />, color: theme.palette.success.main },
    { label: 'Pending Tasks', value: '42', icon: <Assessment />, color: theme.palette.warning.main },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Customer Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your organization and users
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Settings sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Customer Admin Role
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Organization management capabilities
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" paragraph>
            Manage your company's users, configure settings, and access organizational reports.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Manage company users
            <br />
            • Configure company settings
            <br />• View company reports
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomerAdminDashboard;
