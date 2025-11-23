import React from 'react';
import { Box, Typography, Card, CardContent, Grid, useTheme, alpha } from '@mui/material';
import { RateReview, HourglassEmpty, CheckCircle, Visibility } from '@mui/icons-material';

const ReviewerDashboard: React.FC = () => {
  const theme = useTheme();

  const stats = [
    { label: 'Pending Review', value: '15', icon: <HourglassEmpty />, color: theme.palette.warning.main },
    { label: 'Reviewed Today', value: '7', icon: <RateReview />, color: theme.palette.info.main },
    { label: 'Final Approved', value: '156', icon: <CheckCircle />, color: theme.palette.success.main },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Reviewer Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Final review and approval workflow
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
            <Visibility sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Reviewer Role
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Final approval authority
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" paragraph>
            Perform final review of checked entries before final approval.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Review checked entries
            <br />
            • Final approval authority
            <br />• Access comprehensive reports
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReviewerDashboard;
