import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/** Light field on dark glass, matching the client's LineEdit. Prefer `ui/Field` when you need a label. */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className = "", ...props }, ref) {
    return <input ref={ref} {...props} className={`field-input ${className}`} />;
});

export default Input;
