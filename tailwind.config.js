/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        void: '#050000',
        crimson: {
          DEFAULT: '#8B0000',
          mid: '#A50000',
          bright: '#C41E1E',
        },
        gold: {
          DEFAULT: '#C9A84C',
          dim: 'rgba(201,168,76,0.4)',
        },
        cream: {
          DEFAULT: '#F0E0C8',
          dim: 'rgba(240,224,200,0.55)',
          faint: 'rgba(240,224,200,0.08)',
        },
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'moon-float': 'moonFloat 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.3s ease',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(0.8)' },
          '50%': { opacity: '0.9', transform: 'scale(1.2)' },
        },
        moonFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [], // kita tidak pakai tema DaisyUI bawaan, kita kustom sendiri
  },
}