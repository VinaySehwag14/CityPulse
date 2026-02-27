/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './hooks/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f9ff',
                    100: '#e0f3fe',
                    200: '#b9e9fd',
                    300: '#7cd8fc',
                    400: '#36c4f7',
                    500: '#0caee8',
                    600: '#0090c6',
                    700: '#0174a1',
                    800: '#066185',
                    900: '#0a516e',
                    950: '#07364b',
                },
                surface: {
                    DEFAULT: '#0d1117',
                    card: '#161b22',
                    hover: '#1c2128',
                    border: '#30363d',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.25rem',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
                'fade-in': 'fadeIn 0.3s ease forwards',
                'slide-up': 'slideUp 0.35s ease forwards',
            },
            keyframes: {
                fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideUp: { '0%': { transform: 'translateY(12px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
            },
        },
    },
    plugins: [],
};
