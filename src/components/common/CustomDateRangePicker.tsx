import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { type Dayjs } from 'dayjs';
import { Box, Grid, Typography } from '@mui/material';

interface CustomDateRangePickerProps {
  label?: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
  startLabel?: string;
  endLabel?: string;
  disabled?: boolean;
  required?: boolean;
  format?: string;
  error?: {
    startDate?: boolean;
    endDate?: boolean;
  };
  helperText?: {
    startDate?: string;
    endDate?: string;
  };
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  label,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startLabel = 'Start Date',
  endLabel = 'End Date',
  disabled = false,
  required = false,
  format = 'DD/MM/YYYY',
  error,
  helperText,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%' }}>
        {label && (
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            {label}
            {required && <span style={{ color: 'red' }}> *</span>}
          </Typography>
        )}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker
              label={startLabel}
              value={startDate}
              onChange={onStartDateChange}
              disabled={disabled}
              maxDate={endDate || undefined}
              format={format}
              slotProps={{
                textField: {
                  error: error?.startDate,
                  required,
                  fullWidth: true,
                  helperText: helperText?.startDate,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.5rem',
                    },
                  },
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker
              label={endLabel}
              value={endDate}
              onChange={onEndDateChange}
              disabled={disabled}
              minDate={startDate || undefined}
              format={format}
              slotProps={{
                textField: {
                  error: error?.endDate,
                  required,
                  fullWidth: true,
                  helperText: helperText?.endDate,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.5rem',
                    },
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default CustomDateRangePicker;
