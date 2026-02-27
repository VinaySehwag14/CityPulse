import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    glow?: boolean;
}

export default function Card({ hover = false, glow = false, className, children, ...props }: CardProps) {
    return (
        <div
            className={clsx(
                'glass rounded-2xl p-4',
                hover && 'hover:border-[#0caee8]/40 hover:bg-[#1c2128]/80 transition-all duration-200',
                glow && 'brand-glow',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
