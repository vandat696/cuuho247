import { SelectHTMLAttributes, forwardRef } from 'react';
import MuiSelect from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';

interface SelectOption {
  id: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder,
      id,
      disabled,
      required,
      value,
      onChange,
      name    },
    ref
  ) => {
    return (
      <FormControl fullWidth error={!!error}>
        {label && <InputLabel id={`${id}-label`}>{label}</InputLabel>}
        <MuiSelect
          inputRef={ref}
          id={id}
          name={name}
          labelId={label ? `${id}-label` : undefined}
          label={label}
          value={value || ''}
          onChange={onChange as any}
          disabled={disabled}
          required={required}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </MuiSelect>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  }
);

Select.displayName = 'Select';
