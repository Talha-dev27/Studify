/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#050510',
          secondary: '#0A0A1F',
          tertiary: '#0F0F25',
        },
        accent: {
          primary: '#6C63FF',
          glow: '#8B84FF',
          cyan: '#00D4FF',
          pink: '#FF6BD6',
        },
        text: {
          primary: '#F0EEFF',
          secondary: '#8B8BAA',
          muted: '#5C5C7A',
        },
        border: {
          glow: 'rgba(108, 99, 255, 0.3)',
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      backgroundImage: {
        'glow-radial':
          'radial-gradient(circle at 50% 0%, rgba(108,99,255,0.25), transparent 60%)',
        'hero-gradient':
          'linear-gradient(180deg, #050510 0%, #0A0A1F 100%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(108, 99, 255, 0.4)',
        'glow-cyan': '0 0 40px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 80px rgba(108, 99, 255, 0.5)',
        card: '0 8px 32px rgba(108, 99, 255, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};