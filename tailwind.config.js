/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New dark palette
        navy: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        sunset: {
          500: '#f97316',
          400: '#fb923c',
          300: '#fbbf24',
        },
        pine: {
          700: '#065f46',
          600: '#047857',
          500: '#059669',
          400: '#10b981',
        },
        // Keep legacy colors for gradual migration
        forest: '#065f46',
        sage: '#10b981',
        mountain: '#3b82f6',
        earth: '#a16207',
        sand: '#1e293b',
        snow: '#1e293b',
      },
      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
