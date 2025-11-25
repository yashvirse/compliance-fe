import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../app/store';
import { logout } from '../pages/login/slice/Login.slice';
import { selectUser } from '../pages/login/slice/Login.selector';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  alpha,
  Badge,
  ListItemIcon
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Logout,
  AccountCircle,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import Breadcrumb from '../components/Breadcrumb.tsx';
import RoleBasedSidebar from '../components/RoleBasedSidebar.tsx';
import { getDashboardPathForRole, UserRole } from '../config/roleConfig.tsx';

const drawerWidth = 280;
const drawerWidthCollapsed = 65;

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Redirect to role-specific dashboard if on generic /dashboard route
  useEffect(() => {
    if (location.pathname === '/dashboard' && user) {
      const userRole = user.role as UserRole;
      const dashboardPath = getDashboardPathForRole(userRole);
      navigate(dashboardPath, { replace: true });
    }
  }, [location.pathname, user, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/login', { replace: true });
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const currentDrawerWidth = sidebarOpen ? drawerWidth : drawerWidthCollapsed;

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: `linear-gradient(180deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          p: sidebarOpen ? 3 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          minHeight: 64
        }}
      >
        {sidebarOpen && (
          <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 1 }}>
            OcmsPro
          </Typography>
        )}
        <IconButton onClick={handleSidebarToggle} sx={{ color: 'white' }}>
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>
      
      <Divider sx={{ bgcolor: alpha('#fff', 0.2), my: 2 }} />
      
      <RoleBasedSidebar sidebarOpen={sidebarOpen} />

      {sidebarOpen && (
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha('#fff', 0.1),
              border: `1px solid ${alpha('#fff', 0.2)}`
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              Logged in as
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { sm: `${currentDrawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.1)}`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Dashboard
          </Typography>

          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Avatar
              sx={{
                width: 35,
                height: 35,
                bgcolor: theme.palette.primary.main
              }}
            >
              {user?.name.charAt(0)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ 
          width: { sm: currentDrawerWidth }, 
          flexShrink: { sm: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentDrawerWidth,
              border: 'none',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          bgcolor: theme.palette.grey[50],
          minHeight: '100vh',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Breadcrumb />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
