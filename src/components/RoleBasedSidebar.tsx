import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
  Typography,
  Divider,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
  Folder,
  People,
  Business,
  Public,
  Edit,
  FactCheck,
  Assessment,
  Settings,
  Widgets,
} from '@mui/icons-material';
import { selectUser } from '../pages/login/slice/Login.selector';
import { getMenuItemsForRole, type MenuItem, UserRole } from '../config/roleConfig.tsx';

interface RoleBasedSidebarProps {
  sidebarOpen: boolean;
}

// Icon mapping for menu items
const iconMap: Record<string, React.ReactElement> = {
  dashboard: <DashboardIcon />,
  master: <Folder />,
  user: <People />,
  company: <Business />,
  country: <Public />,
  'data-entry': <Edit />,
  'create-entry': <Edit />,
  'pending-entries': <FactCheck />,
  verification: <FactCheck />,
  'check-entries': <FactCheck />,
  'review-entries': <FactCheck />,
  reports: <Assessment />,
  'all-reports': <Assessment />,
  'view-reports': <Assessment />,
  'export-reports': <Assessment />,
  settings: <Settings />,
  components: <Widgets />,
};

const RoleBasedSidebar: React.FC<RoleBasedSidebarProps> = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Get menu items based on user role
  const userRole = (user?.role as UserRole) || UserRole.VIEWER;
  const menuItems = getMenuItemsForRole(userRole);

  const handleMenuClick = (menuId: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const renderMenuItem = (item: MenuItem) => {
    const icon = iconMap[item.id] || <Folder />;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.id] || false;
    const isSelected = item.path === location.pathname;

    if (hasChildren) {
      return (
        <React.Fragment key={item.id}>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <Tooltip title={!sidebarOpen ? item.label : ''} placement="right">
              <ListItemButton
                onClick={() => handleMenuClick(item.id)}
                sx={{
                  borderRadius: 2,
                  justifyContent: sidebarOpen ? 'initial' : 'center',
                  '&:hover': {
                    bgcolor: alpha('#fff', 0.15),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'white',
                    minWidth: sidebarOpen ? 40 : 'auto',
                    mr: sidebarOpen ? 0 : 0,
                    justifyContent: 'center',
                  }}
                >
                  {icon}
                </ListItemIcon>
                {sidebarOpen && (
                  <>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '0.95rem',
                      }}
                    />
                    {isOpen ? <ExpandLess /> : <ExpandMore />}
                  </>
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <Collapse in={isOpen && sidebarOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderMenuItem(child))}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    return (
      <ListItem key={item.id} disablePadding sx={{ mb: hasChildren ? 0.5 : 1, pl: (item.path?.split('/').length ?? 0) > 3 ? 2 : 0 }}>
        <Tooltip title={!sidebarOpen ? item.label : ''} placement="right">
          <ListItemButton
            onClick={() => item.path && handleNavigate(item.path)}
            selected={isSelected}
            sx={{
              borderRadius: 2,
              justifyContent: sidebarOpen ? 'initial' : 'center',
              pl: (item.path?.split('/').length ?? 0) > 3 ? 4 : 2,
              '&:hover': {
                bgcolor: alpha('#fff', 0.15),
              },
              '&.Mui-selected': {
                bgcolor: alpha('#fff', 0.2),
                '&:hover': {
                  bgcolor: alpha('#fff', 0.25),
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: 'white',
                minWidth: sidebarOpen ? 40 : 'auto',
                mr: sidebarOpen ? 0 : 0,
                justifyContent: 'center',
              }}
            >
              {icon}
            </ListItemIcon>
            {sidebarOpen && (
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: (item.path?.split('/').length ?? 0) > 3 ? '0.9rem' : '0.95rem',
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </ListItem>
    );
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {sidebarOpen && user && (
        <>
          <Box sx={{ px: 3, py: 2 }}>
            <Typography variant="caption" sx={{ opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>
              Role
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
              {user.role}
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: alpha('#fff', 0.2), mb: 2 }} />
        </>
      )}
      
      <List sx={{ px: 2, flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => renderMenuItem(item))}
      </List>
    </Box>
  );
};

export default RoleBasedSidebar;
