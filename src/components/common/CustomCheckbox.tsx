import React from 'react';
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Checkbox,
  FormHelperText
} from '@mui/material';
import type { CheckboxProps } from '@mui/material';

interface CheckboxOption {
  label: string;
  value: string | number;
}

interface CustomCheckboxProps {
  label?: string;
  options?: CheckboxOption[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  // For single checkbox
  checked?: boolean;
  onSingleChange?: (checked: boolean) => void;
  singleLabel?: string;
  checkboxProps?: CheckboxProps;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  options,
  value = [],
  onChange,
  helperText,
  error = false,
  required = false,
  checked,
  onSingleChange,
  singleLabel,
  checkboxProps
}) => {
  // Single checkbox mode
  if (singleLabel || (!options && onSingleChange)) {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => onSingleChange?.(e.target.checked)}
            color="primary"
            {...checkboxProps}
          />
        }
        label={singleLabel || ''}
      />
    );
  }

  // Multiple checkboxes mode
  const handleChange = (optionValue: string | number) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  };

  return (
    <FormControl error={error} required={required} component="fieldset">
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <FormGroup>
        {options?.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={value.includes(option.value)}
                onChange={() => handleChange(option.value)}
                color="primary"
                {...checkboxProps}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomCheckbox;
