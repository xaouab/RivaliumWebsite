export default function Spinner({ className = "" }: { className?: string }) {
    return <span
        role="status"
        aria-label="Loading"
        className={`inline-block w-[1em] h-[1em] rounded-[50%] border-2 border-current border-r-transparent animate-spin ${className}`}
    />;
}
