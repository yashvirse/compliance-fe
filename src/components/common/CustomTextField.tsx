import React from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

interface CustomTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({ 
  variant = 'outlined',
  sx,
  ...props 
}) => {
  return (
    <TextField
      variant={variant}
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '0.5rem',
        },
        ...sx
      }}
      {...props}
    />
  );
};

export default CustomTextField;
