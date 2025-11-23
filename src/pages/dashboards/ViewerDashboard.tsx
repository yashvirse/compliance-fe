import React from 'react';
import { Box, Typography, Card, CardContent, Grid, useTheme, alpha } from '@mui/material';
import { Visibility, Assessment, Download } from '@mui/icons-material';

const ViewerDashboard: React.FC = () => {
  const theme = useTheme();

  const stats = [
    { label: 'Reports Available', value: '45', icon: <Assessment />, color: theme.palette.info.main },
    { label: 'Recent Views', value: '18', icon: <Visibility />, color: theme.palette.primary.main },
    { label: 'Downloads', value: '12', icon: <Download />, color: theme.palette.success.main },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Viewer Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and access reports
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
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Viewer Role
          </Typography>
          <Typography variant="body1" paragraph>
            Read-only access to view and download reports.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • View all approved reports
            <br />
            • Download reports
            <br />• No editing permissions
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewerDashboard;
