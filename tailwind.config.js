/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6B35',
          'orange-dark': '#E55A24',
          'orange-light': '#FF8C5A',
          navy: '#0A1628',
          card: '#111F33',
          border: '#1E3550',
          teal: '#00C49A',
          'teal-dark': '#009B7A',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
        'score-fill': 'scoreFill 1.5s ease-out forwards',
        'timer-warn': 'timerWarn 0.8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        timerWarn: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
};
