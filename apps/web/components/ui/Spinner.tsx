import { clsx } from 'clsx';

interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; className?: string; }

const SIZES = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };

export default function Spinner({ size = 'md', className }: SpinnerProps) {
    return (
        <span
            role="status"
            aria-label="Loading"
            className={clsx('block border-2 border-[#30363d] border-t-[#0caee8] rounded-full animate-spin', SIZES[size], className)}
        />
    );
}
