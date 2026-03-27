import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function SignInPage() {
    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-[#0d1117]">
            {/* Animated Background Blobs consistently with Hero */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-[400px]">
                <SignIn
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            card: 'bg-[#161b22] border border-[#30363d] shadow-2xl rounded-2xl',
                            headerTitle: 'text-2xl font-bold tracking-tight text-[#e6edf3]',
                            headerSubtitle: 'text-[#8b949e]',
                            formButtonPrimary: 'bg-[#0caee8] hover:bg-[#0090c6] text-white font-bold py-2.5 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(12,174,232,0.3)]',
                            socialButtonsBlockButton: 'bg-[#1c2128] border border-[#30363d] hover:bg-[#252b33] rounded-xl transition-all duration-200',
                            socialButtonsBlockButtonText: 'text-[#e6edf3] font-medium',
                            formFieldInput: 'bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2.5 text-[#e6edf3] focus:border-[#0caee8] transition-all duration-200',
                            footerActionLink: 'text-[#0caee8] hover:text-[#7cd8fc] font-semibold',
                            dividerLine: 'bg-[#30363d]',
                            dividerText: 'text-[#8b949e] text-xs uppercase tracking-widest',
                            footer: 'hidden',
                        },
                    }}
                />
            </div>
        </div>
    );
}

