import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { type Dayjs } from 'dayjs';
import { Box } from '@mui/material';

interface CustomDatePickerProps {
  label: string;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  format?: string;
  fullWidth?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText,
  disabled = false,
  required = false,
  minDate,
  maxDate,
  format = 'DD/MM/YYYY',
  fullWidth = true,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          format={format}
          slotProps={{
            textField: {
              error,
              required,
              fullWidth,
              helperText: helperText,
              sx: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '0.5rem',
                },
              },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
