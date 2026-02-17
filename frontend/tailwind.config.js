/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'void-black': '#000000',
                'void-card': '#050505',
                'terminal-green': '#10b981',
                'system-amber': '#f59e0b',
                'zinc-850': '#1f1f22',
            },
            fontFamily: {
                sans: ['Inter Tight', 'Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
                geist: ['Geist Mono', 'JetBrains Mono', 'monospace'],
            },
            animation: {
                'glitch': 'glitch 0.3s cubic-bezier(.25,.46,.45,.94) both infinite',
                'scanline': 'scanline 10s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                glitch: {
                    '0%': { transform: 'translate(0)' },
                    '20%': { transform: 'translate(-2px, 2px)' },
                    '40%': { transform: 'translate(-2px, -2px)' },
                    '60%': { transform: 'translate(2px, 2px)' },
                    '80%': { transform: 'translate(2px, -2px)' },
                    '100%': { transform: 'translate(0)' },
                },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                }
            },
            boxShadow: {
                'terminal': '0 0 20px rgba(16, 185, 129, 0.2)',
                'amber': '0 0 20px rgba(245, 158, 11, 0.2)',
            }
        },
    },
    plugins: [],
}
