import * as React from "react";

export function Card({
    className = "",
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`rounded-2xl border border-slate-700 bg-slate-800 text-slate-100 shadow-xl overflow-hidden ${className}`}
            {...props}
        />
    );
}

export function CardHeader({
    className = "",
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
    );
}

export function CardTitle({
    className = "",
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={`text-xl font-bold leading-none tracking-tight text-slate-100 ${className}`}
            {...props}
        />
    );
}

export function CardDescription({
    className = "",
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p className={`text-sm text-slate-400 ${className}`} {...props} />;
}

export function CardContent({
    className = "",
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`p-6 pt-0 ${className}`} {...props} />;
}
