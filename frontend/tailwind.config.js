/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        qubic: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'dark-bg': '#0a0e27',
        'dark-card': '#111b3c',
        'dark-border': '#1e293b',
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'mono': ['Fira Code', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '40px'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(14, 165, 233, 0.25)',
        'glow-lg': '0 0 40px rgba(14, 165, 233, 0.4)',
        'glow-md': '0 0 15px rgba(14, 165, 233, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(14, 165, 233, 0.1)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 13px rgba(0, 0, 0, 0.1)',
        'card-lg': '0 20px 25px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'bounce-light': 'bounce-light 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(14, 165, 233, 0.25)' },
          '50%': { 'box-shadow': '0 0 40px rgba(14, 165, 233, 0.4)' },
        },
        'float': {
          '0%, 100%': { 'transform': 'translateY(0px)' },
          '50%': { 'transform': 'translateY(-20px)' },
        },
        'slide-in': {
          'from': { 'transform': 'translateX(-100%)', 'opacity': '0' },
          'to': { 'transform': 'translateX(0)', 'opacity': '1' },
        },
        'fade-in': {
          'from': { 'opacity': '0' },
          'to': { 'opacity': '1' },
        },
        'bounce-light': {
          '0%, 100%': { 'transform': 'translateY(0)' },
          '50%': { 'transform': 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { 'background-position': '-1000px 0' },
          '100%': { 'background-position': '1000px 0' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
