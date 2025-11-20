import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

interface DropdownOption {
  label: string;
  value: string | number;
}

interface CustomDropdownProps extends Omit<TextFieldProps, 'select' | 'variant'> {
  options: DropdownOption[];
  variant?: 'outlined' | 'filled' | 'standard';
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  options,
  variant = 'outlined',
  sx,
  ...props 
}) => {
  return (
    <TextField
      select
      variant={variant}
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '0.5rem',
        },
        ...sx
      }}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CustomDropdown;
