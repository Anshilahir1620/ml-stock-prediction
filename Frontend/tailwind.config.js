/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"System-ui"', 'sans-serif'],
        serif: ['"Georgia"', 'serif'],
      },
      colors: {
        background: '#F5F5F0', // Light Sand
        primary: '#1C1C1C',    // Charcoal
        signal: {
          buy: '#1B4332',      // Deep Green
          sell: '#9B2226',     // Muted Red
          hold: '#D4A373',     // Amber / Ochre
        },
        slate: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#1A1A1A',
        },
        olive: '#4A4E2F',
        graphite: '#353535',
      },
      letterSpacing: {
        wider: '.05em',
        widest: '.1em',
      },
    },
  },
  plugins: [],
}

