import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, rightIcon, onRightIconClick, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const fieldClass = [
      'input-field',
      error ? 'input-field--error' : '',
      leftIcon ? 'input-field--has-left' : '',
      rightIcon ? 'input-field--has-right' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="input-group">
        {label && <label htmlFor={inputId} className="input-label">{label}</label>}

        <div className={leftIcon || rightIcon ? 'input-wrapper' : undefined}>
          {leftIcon && <span className="input-icon">{leftIcon}</span>}

          <input ref={ref} id={inputId} className={fieldClass} {...props} />

          {rightIcon && (
            onRightIconClick ? (
              <button
                type="button"
                className="input-icon input-icon--right"
                onClick={onRightIconClick}
                aria-label="Input action"
              >
                {rightIcon}
              </button>
            ) : (
              <span className="input-icon input-icon--right">
                {rightIcon}
              </span>
            )
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
