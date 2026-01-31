/**
 * EmptyState Component - Consistent empty state display
 */

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Assignment } from '@mui/icons-material';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  minHeight?: number | string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Assignment sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />,
  title = 'No data available',
  message = 'There are no items to display',
  actionLabel,
  onAction,
  minHeight = 300,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight,
        textAlign: 'center',
        py: 6,
        px: 2,
      }}
    >
      {icon}
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {message}
      </Typography>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={{ mt: 2 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
