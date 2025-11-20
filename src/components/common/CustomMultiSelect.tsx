import React from 'react';
import {
  TextField,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  Box
} from '@mui/material';
import type { TextFieldProps } from '@mui/material';

interface MultiSelectOption {
  label: string;
  value: string | number;
}

interface CustomMultiSelectProps extends Omit<TextFieldProps, 'select' | 'variant' | 'value' | 'onChange'> {
  options: MultiSelectOption[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  variant?: 'outlined' | 'filled' | 'standard';
  renderValue?: 'chips' | 'text';
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({ 
  options,
  value = [],
  onChange,
  variant = 'outlined',
  renderValue = 'chips',
  sx,
  ...props 
}) => {
  const handleChange = (event: any) => {
    const selectedValue = event.target.value;
    onChange(typeof selectedValue === 'string' ? selectedValue.split(',') : selectedValue);
  };

  const getDisplayValue = (selected: unknown) => {
    const selectedArray = selected as (string | number)[];
    
    if (renderValue === 'chips') {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selectedArray.map((val) => {
            const option = options.find((opt) => opt.value === val);
            return (
              <Chip
                key={val}
                label={option?.label || val}
                size="small"
                sx={{ height: 24 }}
              />
            );
          })}
        </Box>
      );
    }
    
    // Text mode
    return selectedArray
      .map((val) => {
        const option = options.find((opt) => opt.value === val);
        return option?.label || val;
      })
      .join(', ');
  };

  return (
    <TextField
      select
      variant={variant}
      fullWidth
      value={value}
      onChange={handleChange}
      SelectProps={{
        multiple: true,
        renderValue: getDisplayValue,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '0.5rem',
        },
        ...sx,
      }}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Checkbox checked={value.indexOf(option.value) > -1} />
          <ListItemText primary={option.label} />
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CustomMultiSelect;
