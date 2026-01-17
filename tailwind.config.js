/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Crimson Pro', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        extralight: 200,
        light: 300,
        normal: 400,
      },
      colors: {
        bg: {
          primary: '#0a0a0b',
          secondary: '#111113',
          tertiary: '#18181b',
          elevated: '#1f1f23',
        },
        border: {
          subtle: '#27272a',
          DEFAULT: '#3f3f46',
          strong: '#52525b',
        },
        text: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          tertiary: '#71717a',
          disabled: '#52525b',
        },
        status: {
          normal: '#4a9f7e',
          warning: '#c9a227',
          critical: '#b85c5c',
          info: '#6b8cae',
        },
        accent: {
          primary: '#6b8cae',
          'primary-hover': '#7d9bba',
          agent: '#8b7fb8',
        },
      },
      backgroundColor: {
        'status-normal': 'rgba(74, 159, 126, 0.08)',
        'status-warning': 'rgba(201, 162, 39, 0.08)',
        'status-critical': 'rgba(184, 92, 92, 0.08)',
        'status-info': 'rgba(107, 140, 174, 0.08)',
        'accent-primary': 'rgba(107, 140, 174, 0.1)',
        'accent-agent': 'rgba(139, 127, 184, 0.08)',
      },
      borderColor: {
        'status-normal': 'rgba(74, 159, 126, 0.2)',
        'status-warning': 'rgba(201, 162, 39, 0.2)',
        'status-critical': 'rgba(184, 92, 92, 0.2)',
        'status-info': 'rgba(107, 140, 174, 0.2)',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.3)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.5)',
        'inner': 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'blink': 'blink 800ms infinite',
        'slide-in-right': 'slide-in-right 250ms ease-out',
        'slide-out-up': 'slide-out-up 200ms ease-in',
        'fade-in': 'fade-in 200ms ease-out',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-up': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-10px)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
