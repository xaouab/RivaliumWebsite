import { ReactNode, useId } from "react";
import Input from "@/components/Input";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    hint?: ReactNode;
    error?: string | null;
    /** Content shown to the right of the label, e.g. a "Forgot password?" link. */
    aside?: ReactNode;
};

/** Labelled input with hint and inline error, wired up for screen readers. */
export default function Field({ label, hint, error, aside, className = "", ...props }: FieldProps) {
    const id = useId();
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;

    return <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        <div className="flex items-baseline justify-between gap-2">
            <label htmlFor={id} className="label-caps caps-md text-ice">{label}</label>
            {aside}
        </div>
        <Input
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
            {...props}
        />
        {hint && !error && <p id={hintId} className="font-body text-sm text-lavender/80">{hint}</p>}
        {error && <p id={errorId} className="font-body text-sm text-danger" role="alert">{error}</p>}
    </div>;
}

type TextAreaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: ReactNode; error?: string | null };

/** Multi-line version of Field (messages, descriptions). */
export function TextAreaField({ label, hint, error, className = "", ...props }: TextAreaFieldProps) {
    const id = useId();
    const describedBy = [hint && !error ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
    return <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        <label htmlFor={id} className="label-caps caps-md text-ice">{label}</label>
        <textarea id={id} className="field-input" aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...props} />
        {hint && !error && <p id={`${id}-hint`} className="font-body text-sm text-lavender/80">{hint}</p>}
        {error && <p id={`${id}-error`} className="font-body text-sm text-danger" role="alert">{error}</p>}
    </div>;
}
