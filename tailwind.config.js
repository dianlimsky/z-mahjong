/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#090909',
        panel: '#141412',
        panelElevated: '#1b1916',
        brand: '#ff0000',
        brandDark: '#cc0000',
        gold: '#d4a94f',
        jade: '#1e5b4d',
        ivory: '#f7f2e7',
      },
      boxShadow: {
        glow: '0 0 32px rgba(255, 0, 0, 0.22)',
        card: '0 12px 40px rgba(0, 0, 0, 0.28)',
      },
      keyframes: {
        'soft-in': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'confetti-fall': { '0%': { opacity: '1', transform: 'translateY(-20px) translateX(0) rotate(0deg)' }, '100%': { opacity: '0', transform: 'translateY(100vh) translateX(var(--drift, 0px)) rotate(720deg)' } },
        'winner-pop': { '0%': { transform: 'scale(.96)', opacity: '0' }, '70%': { transform: 'scale(1.03)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
               'glow-pulse': { '0%, 100%': { boxShadow: '0 0 0 rgba(255,0,0,0)' }, '50%': { boxShadow: '0 0 30px rgba(255,0,0,.34)' } },
        'float-cloud': { '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.03' }, '50%': { transform: 'translateY(-12px) scale(1.05)', opacity: '0.06' } },
      },
      animation: {
        'soft-in': 'soft-in .35s ease-out both',
        'winner-pop': 'winner-pop .45s ease-out both',
        'glow-pulse': 'glow-pulse 1.5s ease-in-out both',
        'float-cloud': 'float-cloud 8s ease-in-out infinite',
        'confetti-fall': 'confetti-fall 2.5s cubic-bezier(.23,.86,.6,1) both',
      },
    },
  },
  plugins: [],
}
