import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  alpha,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  People,
  Assignment,
  CheckCircle
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactElement;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 30px ${alpha(theme.palette.common.black, 0.12)}`
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ color: color }}>
              {change}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(color, 0.1),
              color: color
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardHome: React.FC = () => {
  const theme = useTheme();

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+12.5% from last month',
      icon: <TrendingUp />,
      color: theme.palette.success.main
    },
    {
      title: 'Active Users',
      value: '2,456',
      change: '+8.2% from last month',
      icon: <People />,
      color: theme.palette.primary.main
    },
    {
      title: 'Pending Tasks',
      value: '127',
      change: '-3.1% from last month',
      icon: <Assignment />,
      color: theme.palette.warning.main
    },
    {
      title: 'Completed',
      value: '892',
      change: '+15.3% from last month',
      icon: <CheckCircle />,
      color: theme.palette.info.main
    }
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Welcome Back!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening with your projects today.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ mt: 3 }}>
                {[
                  { project: 'Project Alpha', progress: 75, color: theme.palette.primary.main },
                  { project: 'Project Beta', progress: 45, color: theme.palette.success.main },
                  { project: 'Project Gamma', progress: 90, color: theme.palette.info.main },
                  { project: 'Project Delta', progress: 30, color: theme.palette.warning.main }
                ].map((item, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {item.project}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.progress}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        bgcolor: alpha(item.color, 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: item.color,
                          borderRadius: 1
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ mt: 2 }}>
                {['Create New Report', 'Schedule Meeting', 'Send Invoice', 'View Analytics'].map((action, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {action}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
