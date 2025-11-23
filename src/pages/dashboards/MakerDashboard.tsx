import React from 'react';
import { Box, Typography, Card, CardContent, Grid, useTheme, alpha } from '@mui/material';
import { Edit, PendingActions, CheckCircle } from '@mui/icons-material';

const MakerDashboard: React.FC = () => {
  const theme = useTheme();

  const stats = [
    { label: 'Created Today', value: '8', icon: <Edit />, color: theme.palette.primary.main },
    { label: 'Pending Review', value: '15', icon: <PendingActions />, color: theme.palette.warning.main },
    { label: 'Approved', value: '127', icon: <CheckCircle />, color: theme.palette.success.main },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Maker Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create and manage data entries
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
            Maker Role
          </Typography>
          <Typography variant="body1" paragraph>
            Create and submit data entries for verification.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Create new data entries
            <br />
            • Edit draft entries
            <br />• Submit for checker review
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MakerDashboard;
