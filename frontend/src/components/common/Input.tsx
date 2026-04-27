import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, forwardRef, useId } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, rightIcon, onRightIconClick, className, id, type, disabled, ...props }, ref) => {
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
      error: !!error,
      helperText: error || hint,
      slotProps: {
        input: {
          startAdornment: leftIcon ? <InputAdornment position="start">{leftIcon}</InputAdornment> : undefined,
          endAdornment: rightIcon ? (
            <InputAdornment position="end">
              {onRightIconClick ? (
                <IconButton onClick={onRightIconClick} edge="end" size="small">
                  {rightIcon}
                </IconButton>
              ) : (
                rightIcon
              )}
            </InputAdornment>
          ) : undefined,
        },
        htmlInput: props,
      },
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

    const textFieldProps: TextFieldProps = {
      inputRef: ref,
      id: inputId,
      className,
      label,
      fullWidth: true,
      multiline: true,
      variant: 'outlined',
      disabled,
      error: !!error,
      helperText: error || hint,
      slotProps: {
        htmlInput: props,
      },
    };

    return <TextField {...textFieldProps} />;
  }
);

Textarea.displayName = 'Textarea';
