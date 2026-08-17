import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning";
}

export function Badge({
    className = "",
    variant = "default",
    ...props
}: Readonly<BadgeProps>) {
    const variantStyles = {
        default: "bg-blue-600 text-white border-transparent",
        secondary: "bg-slate-700 text-slate-100 border-transparent",
        destructive: "bg-rose-600 text-white border-transparent",
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        outline: "text-slate-200 border-slate-700 bg-transparent",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none ${variantStyles[variant]} ${className}`}
            {...props}
        />
    );
}
