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
      colors: {
        // Catppuccin Mocha dark palette (great for screen sharing)
        'ctp-base':    '#1e1e2e',
        'ctp-mantle':  '#181825',
        'ctp-crust':   '#11111b',
        'ctp-surface0':'#313244',
        'ctp-surface1':'#45475a',
        'ctp-overlay': '#6c7086',
        'ctp-text':    '#cdd6f4',
        'ctp-subtext': '#a6adc8',
        'ctp-blue':    '#89b4fa',
        'ctp-green':   '#a6e3a1',
        'ctp-yellow':  '#f9e2af',
        'ctp-red':     '#f38ba8',
        'ctp-mauve':   '#cba6f7',
        'ctp-peach':   '#fab387',
        'ctp-sky':     '#89dceb',
        'ctp-teal':    '#94e2d5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Cascadia Code', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.3s ease',
        'pulse-border': 'pulseBorder 1s ease infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseBorder: {
          '0%, 100%': { borderColor: 'rgb(137, 180, 250, 0.3)' },
          '50%': { borderColor: 'rgb(137, 180, 250, 1)' },
        },
      },
    },
  },
  plugins: [],
}
