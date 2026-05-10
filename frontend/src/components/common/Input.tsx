import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, forwardRef, useId } from 'react';
import { TextField, TextFieldProps, InputAdornment, IconButton } from '@mui/material';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  rightIconAriaLabel?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      leftIcon,
      rightIcon,
      onRightIconClick,
      rightIconAriaLabel,
      className,
      id,
      type,
      disabled,
      required,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const textFieldProps: TextFieldProps = {
      inputRef: ref,
      id: inputId,
      className,
      label,
      fullWidth: true,
      variant: 'outlined',
      type,
      disabled,
      value,
      onChange,
      required,
      error: !!error,
      helperText: error || hint,
      InputProps: {
        startAdornment: leftIcon ? <InputAdornment position="start">{leftIcon}</InputAdornment> : undefined,
        endAdornment: rightIcon ? (
          <InputAdornment position="end">
            {onRightIconClick ? (
              <IconButton
                onClick={onRightIconClick}
                edge="end"
                size="small"
                aria-label={rightIconAriaLabel || 'Action'}
              >
                {rightIcon}
              </IconButton>
            ) : (
              rightIcon
            )}
          </InputAdornment>
        ) : undefined,
      },
      inputProps: props,
    };

    return <TextField {...textFieldProps} />;
  }
);

Input.displayName = 'Input';

/* ── Textarea variant ─────────────────────────────── */
interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const { value, onChange, required, ...otherProps } = props;

    const textFieldProps: TextFieldProps = {
      inputRef: ref,
      id: inputId,
      className,
      label,
      fullWidth: true,
      multiline: true,
      variant: 'outlined',
      disabled,
      value,
      onChange,
      required,
      error: !!error,
      helperText: error || hint,
      inputProps: otherProps,
    };

    return <TextField {...textFieldProps} />;
  }
);

Textarea.displayName = 'Textarea';
