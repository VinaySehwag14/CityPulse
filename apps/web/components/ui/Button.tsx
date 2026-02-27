import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
}

const BASE = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0caee8]';

const VARIANTS: Record<Variant, string> = {
    primary: 'bg-[#0caee8] text-white hover:bg-[#0090c6] active:scale-[0.97]',
    secondary: 'bg-[#1c2128] text-[#e6edf3] border border-[#30363d] hover:bg-[#252b33] active:scale-[0.97]',
    ghost: 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#1c2128]',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
};

const SIZES: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={clsx(BASE, VARIANTS[variant], SIZES[size], className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    );
}
