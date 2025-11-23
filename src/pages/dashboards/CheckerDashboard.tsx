import React from 'react';
import { Box, Typography, Card, CardContent, Grid, useTheme, alpha } from '@mui/material';
import { FactCheck, HourglassEmpty, CheckCircle, Cancel } from '@mui/icons-material';

const CheckerDashboard: React.FC = () => {
  const theme = useTheme();

  const stats = [
    { label: 'Pending Check', value: '23', icon: <HourglassEmpty />, color: theme.palette.warning.main },
    { label: 'Checked Today', value: '12', icon: <FactCheck />, color: theme.palette.info.main },
    { label: 'Approved', value: '89', icon: <CheckCircle />, color: theme.palette.success.main },
    { label: 'Rejected', value: '4', icon: <Cancel />, color: theme.palette.error.main },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Checker Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Verify and validate data entries
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
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
            Checker Role
          </Typography>
          <Typography variant="body1" paragraph>
            Review and verify data entries created by makers.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Review pending entries
            <br />
            • Approve or reject entries
            <br />• Provide feedback to makers
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CheckerDashboard;
