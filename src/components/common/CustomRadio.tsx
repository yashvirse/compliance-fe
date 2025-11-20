import React from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText
} from '@mui/material';
import type { RadioProps } from '@mui/material';

interface RadioOption {
  label: string;
  value: string | number;
}

interface CustomRadioProps {
  label?: string;
  options: RadioOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  row?: boolean;
  radioProps?: RadioProps;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  label,
  options,
  value,
  onChange,
  helperText,
  error = false,
  required = false,
  row = false,
  radioProps
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl error={error} required={required} component="fieldset">
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <RadioGroup row={row} value={value} onChange={handleChange}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio color="primary" {...radioProps} />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomRadio;
