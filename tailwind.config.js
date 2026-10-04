/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Same typography as PlaylistVault: Outfit body + Space Grotesk display.
        sans: ['Outfit', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'system-ui', 'sans-serif']
      },
      colors: {
        // Green reskin: accent indigo -> emerald scale.
        accent: {
          DEFAULT: '#22C55E',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D'
        },
        vault: {
          950: '#04120A',
          900: '#071A0E',
          850: '#0B2417',
          800: '#0E2E1C',
          700: '#143D26',
          600: '#1B4D30'
        },
        edu: {
          emerald: '#10B981',
          lime: '#A3E635',
          teal: '#14B8A6'
        }
      },
      backgroundImage: {
        'gradient-mesh':
          'radial-gradient(80rem 55rem at 4% -10%, rgba(34,197,94,0.18), transparent 58%), radial-gradient(70rem 45rem at 98% -4%, rgba(163,230,53,0.10), transparent 52%)'
      },
      boxShadow: {
        glass: '0 12px 48px rgba(0, 0, 0, 0.45), 0 3px 12px rgba(0, 0, 0, 0.35)',
        glow: '0 0 0 1px rgba(34, 197, 94, 0.38), 0 10px 36px rgba(34, 197, 94, 0.28)',
        'edu-glow':
          '0 0 0 1px rgba(34, 197, 94, 0.35), 0 12px 40px rgba(34, 197, 94, 0.30), 0 0 80px rgba(20, 184, 166, 0.12)'
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        floaty: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        pulseSoft: { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.45 } },
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } }
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2.2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both'
      }
    }
  },
  plugins: []
};
