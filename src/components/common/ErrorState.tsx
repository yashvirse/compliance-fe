/**
 * ErrorState Component - Consistent error display
 */

import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface ErrorStateProps {
  error?: string | null;
  onRetry?: () => void;
  title?: string;
  minHeight?: number | string;
  showDetails?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error = 'Something went wrong',
  onRetry,
  title = 'Error occurred',
  minHeight = 300,
  showDetails = false,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight,
        py: 4,
        px: 2,
      }}
    >
      <Alert
        severity="error"
        icon={<ErrorIcon />}
        sx={{ width: '100%', maxWidth: 500, mb: 2 }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        {showDetails && error && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Alert>

      {onRetry && (
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
