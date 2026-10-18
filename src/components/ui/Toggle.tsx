import { useId } from "react";

type ToggleProps = {
    label: string;
    description?: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
};

/** Switch row for preferences. The whole row is the hit target. */
export default function Toggle({ label, description, checked, disabled, onChange }: ToggleProps) {
    const id = useId();
    return <label htmlFor={id} className={`flex items-start justify-between gap-4 py-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
        <span className="flex flex-col gap-0.5">
            <span className="font-body text-ink">{label}</span>
            {description && <span id={`${id}-desc`} className="font-body text-sm text-lavender/80">{description}</span>}
        </span>
        <span className="relative shrink-0 mt-0.5">
            <input
                id={id}
                type="checkbox"
                role="switch"
                className="peer sr-only"
                checked={checked}
                disabled={disabled}
                aria-describedby={description ? `${id}-desc` : undefined}
                onChange={(event) => onChange(event.target.checked)}
            />
            <span className="block w-11 h-6 rounded-full bg-night/60 border border-ice/20 transition-colors duration-200 peer-checked:bg-frost/70 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-ice peer-focus-visible:outline-offset-2" />
            <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ease-brand peer-checked:translate-x-5" />
        </span>
    </label>;
}
