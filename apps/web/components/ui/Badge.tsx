import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

type BadgeVariant = 'live' | 'trending' | 'going' | 'interested' | 'default';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const VARIANTS: Record<BadgeVariant, string> = {
    live: 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30',
    trending: 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30',
    going: 'bg-[#0caee8]/15 text-[#0caee8] border border-[#0caee8]/30',
    interested: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    default: 'bg-[#1c2128] text-[#8b949e] border border-[#30363d]',
};

export default function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
    return (
        <span
            className={clsx('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium', VARIANTS[variant], className)}
            {...props}
        >
            {variant === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot" />}
            {children}
        </span>
    );
}
