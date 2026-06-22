/***** Tailwind Config *****/
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Refined palette
        primary: '#4f46e5',      // indigo-600
        secondary: '#475569',    // slate-600
        accent: '#f59e0b',       // amber-500
        bg: '#f9fafb',           // gray-50
        success: '#059669',      // emerald-600
        error: '#e11d48'         // rose-600
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 300ms ease-out',
        slideUp: 'slideUp 250ms ease-out'
      }
    }
  },
  plugins: []
}
