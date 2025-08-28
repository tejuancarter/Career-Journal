/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Dark theme colors inspired by Apple/OpenAI
        'dark-background': '#000000',
        'dark-surface': '#111111',
        'dark-surface-light': '#1a1a1a',
        'dark-border': '#2a2a2a',
        'dark-text': '#ffffff',
        'dark-text-muted': '#a0a0a0',
        'dark-text-disabled': '#666666',
        'dark-accent': '#007AFF',
        'dark-accent-hover': '#0056CC',
        'dark-success': '#34C759',
        'dark-warning': '#FF9500',
        'dark-error': '#FF3B30',
        
        // Light theme colors
        'light-background': '#ffffff',
        'light-surface': '#f8f9fa',
        'light-surface-light': '#f1f3f4',
        'light-border': '#e1e5e9',
        'light-text': '#1d1d1f',
        'light-text-muted': '#86868b',
        'light-text-disabled': '#d2d2d7',
        'light-accent': '#007AFF',
        'light-accent-hover': '#0056CC',
        'light-success': '#34C759',
        'light-warning': '#FF9500',
        'light-error': '#FF3B30',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-dots': 'pulseDots 1.5s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseDots: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}