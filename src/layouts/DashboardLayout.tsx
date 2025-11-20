import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  alpha,
  Badge,
  Collapse,
  Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Logout,
  AccountCircle,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  Folder,
  People,
  Business,
  Public
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.tsx';
import Breadcrumb from '../components/Breadcrumb.tsx';

const drawerWidth = 280;
const drawerWidthCollapsed = 65;

interface MenuItemType {
  text: string;
  icon: React.ReactElement;
  path?: string;
  children?: MenuItemType[];
}

const menuItems: MenuItemType[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { 
    text: 'Master', 
    icon: <Folder />, 
    children: [
      { text: 'User', icon: <People />, path: '/dashboard/master/user' },
      { text: 'Company', icon: <Business />, path: '/dashboard/master/company' },
      { text: 'Country', icon: <Public />, path: '/dashboard/master/country' },
    ]
  },
  { text: 'Form', icon: <DescriptionIcon />, path: '/dashboard/form' },
  { text: 'Components', icon: <SettingsIcon />, path: '/dashboard/components' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/dashboard/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
];

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [masterOpen, setMasterOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

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
    logout();
    navigate('/login');
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMasterClick = () => {
    setMasterOpen(!masterOpen);
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
            ComplianceFE
          </Typography>
        )}
        <IconButton onClick={handleSidebarToggle} sx={{ color: 'white' }}>
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>
      
      <Divider sx={{ bgcolor: alpha('#fff', 0.2), my: 2 }} />
      
      <List sx={{ px: 2, flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            {item.children ? (
              <>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <Tooltip title={!sidebarOpen ? item.text : ''} placement="right">
                    <ListItemButton
                      onClick={handleMasterClick}
                      sx={{
                        borderRadius: 2,
                        justifyContent: sidebarOpen ? 'initial' : 'center',
                        '&:hover': {
                          bgcolor: alpha('#fff', 0.15),
                        }
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: 'white', 
                        minWidth: sidebarOpen ? 40 : 'auto',
                        mr: sidebarOpen ? 0 : 0,
                        justifyContent: 'center'
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      {sidebarOpen && (
                        <>
                          <ListItemText 
                            primary={item.text}
                            primaryTypographyProps={{
                              fontWeight: 500,
                              fontSize: '0.95rem'
                            }}
                          />
                          {masterOpen ? <ExpandLess /> : <ExpandMore />}
                        </>
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
                <Collapse in={masterOpen && sidebarOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItem key={child.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                          onClick={() => navigate(child.path!)}
                          selected={location.pathname === child.path}
                          sx={{
                            pl: 4,
                            borderRadius: 2,
                            '&:hover': {
                              bgcolor: alpha('#fff', 0.15),
                            },
                            '&.Mui-selected': {
                              bgcolor: alpha('#fff', 0.2),
                              '&:hover': {
                                bgcolor: alpha('#fff', 0.25),
                              }
                            }
                          }}
                        >
                          <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={child.text}
                            primaryTypographyProps={{
                              fontWeight: 500,
                              fontSize: '0.9rem'
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem disablePadding sx={{ mb: 1 }}>
                <Tooltip title={!sidebarOpen ? item.text : ''} placement="right">
                  <ListItemButton
                    onClick={() => navigate(item.path!)}
                    selected={location.pathname === item.path}
                    sx={{
                      borderRadius: 2,
                      justifyContent: sidebarOpen ? 'initial' : 'center',
                      '&:hover': {
                        bgcolor: alpha('#fff', 0.15),
                      },
                      '&.Mui-selected': {
                        bgcolor: alpha('#fff', 0.2),
                        '&:hover': {
                          bgcolor: alpha('#fff', 0.25),
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: 'white', 
                      minWidth: sidebarOpen ? 40 : 'auto',
                      mr: sidebarOpen ? 0 : 0,
                      justifyContent: 'center'
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: '0.95rem'
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>

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
