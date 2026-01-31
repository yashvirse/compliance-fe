/**
 * DashboardHeader Component - Reusable dashboard header
 * Benefits: Consistency, reduced duplication, easy maintenance
 */

import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface DashboardHeaderProps {
  /** Main title */
  title: string;
  
  /** Subtitle/description */
  subtitle?: string;
  
  /** Back button callback */
  onBack?: () => void;
  
  /** Show back button */
  showBackButton?: boolean;
  
  /** Back button label */
  backButtonLabel?: string;
  
  /** Additional action buttons/elements */
  actions?: React.ReactNode;
  
  /** Custom spacing */
  spacing?: number;
}

/**
 * DashboardHeader Component
 * 
 * Usage:
 * ```tsx
 * <DashboardHeader
 *   title="Pending Tasks"
 *   subtitle="Review and approve pending tasks"
 *   onBack={() => navigate('/dashboard')}
 *   actions={<Button>Export</Button>}
 * />
 * ```
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  onBack,
  showBackButton = true,
  backButtonLabel = 'Back to Dashboard',
  actions,
  spacing = 3,
}) => {
  return (
    <Box
      sx={{
        mb: spacing,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 2,
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
      }}
    >
      {/* Title Section */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Actions Section */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        {actions && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            {actions}
          </Box>
        )}

        {showBackButton && onBack && (
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={onBack}
            sx={{
              whiteSpace: 'nowrap',
              textTransform: 'none',
            }}
          >
            {backButtonLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default DashboardHeader;
