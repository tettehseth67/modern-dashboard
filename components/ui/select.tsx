import * as React from "react";

export function Select({
    children,
    ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <div className="relative w-full">{children}</div>;
}

export function SelectTrigger({
    className = "",
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`relative w-full ${className}`}>{children}</div>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
    return <span className="text-sm text-slate-400">{placeholder}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

// Custom wrapper to fall back gracefully to a standard, stylized native option list block
export function SelectItem({
    value,
    children,
    ...props
}: React.OptionHTMLAttributes<HTMLOptionElement>) {
    return (
        <option value={value} className="bg-slate-800 text-slate-100" {...props}>
            {children}
        </option>
    );
}
