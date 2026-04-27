import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, rightIcon, onRightIconClick, className = '', ...props }, ref) => {
    const fieldClass = [
      'input-field',
      error ? 'input-field--error' : '',
      rightIcon ? 'input-field--has-right' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="input-group">
        {label && <label className="input-label">{label}</label>}

        <div className={leftIcon || rightIcon ? 'input-wrapper' : undefined}>
          {leftIcon && <span className="input-icon">{leftIcon}</span>}

          <input ref={ref} className={fieldClass} {...props} />

          {rightIcon && (
            <span
              className="input-icon input-icon--right"
              onClick={onRightIconClick}
              role={onRightIconClick ? 'button' : undefined}
            >
              {rightIcon}
            </span>
          )}
        </div>

        {error && <span className="input-error">{error}</span>}
        {!error && hint && <span className="input-hint">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

/* ── Textarea variant ─────────────────────────────── */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Textarea({ label, hint, error, className = '', ...props }: TextareaProps) {
  const fieldClass = ['input-field', 'input-field--textarea', error ? 'input-field--error' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <textarea className={fieldClass} {...props} />
      {error && <span className="input-error">{error}</span>}
      {!error && hint && <span className="input-hint">{hint}</span>}
    </div>
  );
}
