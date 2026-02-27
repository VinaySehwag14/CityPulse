import Image from 'next/image';
import { clsx } from 'clsx';

interface AvatarProps {
    src?: string | null;
    name?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const SIZES = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
const PX = { sm: 28, md: 36, lg: 48 };

export default function Avatar({ src, name = '?', size = 'md', className }: AvatarProps) {
    const initial = name.charAt(0).toUpperCase();
    return (
        <div className={clsx('relative rounded-full overflow-hidden bg-[#1c2128] flex items-center justify-center border border-[#30363d] flex-shrink-0', SIZES[size], className)}>
            {src ? (
                <Image src={src} alt={name} width={PX[size]} height={PX[size]} className="object-cover" />
            ) : (
                <span className="font-semibold text-[#0caee8]">{initial}</span>
            )}
        </div>
    );
}
