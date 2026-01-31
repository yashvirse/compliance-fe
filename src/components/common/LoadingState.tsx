/**
 * LoadingState Component - Consistent loading display
 */

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  minHeight?: number | string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  minHeight = 400,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight,
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress size={50} />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingState;
