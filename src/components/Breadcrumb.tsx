import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { Home as HomeIcon, NavigateNext } from '@mui/icons-material';

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap: { [key: string]: string } = {
    dashboard: 'Dashboard',
    master: 'Master',
    user: 'User',
    company: 'Company',
    country: 'Country',
    form: 'Form',
    components: 'Components',
    reports: 'Reports',
    settings: 'Settings'
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 1
          }
        }}
      >
        <Link
          component="button"
          underline="hover"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.dark'
            }
          }}
          onClick={() => navigate('/dashboard')}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Home
        </Link>

        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = breadcrumbNameMap[value] || value;

          return last ? (
            <Typography
              key={to}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.primary',
                fontWeight: 500
              }}
            >
              {label}
            </Typography>
          ) : (
            <Link
              key={to}
              component="button"
              underline="hover"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.dark'
                }
              }}
              onClick={() => navigate(to)}
            >
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
