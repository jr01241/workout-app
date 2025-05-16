/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f3f4f6',
          foreground: '#1f2937',
        },
        muted: {
          DEFAULT: '#e5e7eb',
          foreground: '#6b7280',
        },
        background: '#ffffff',
        card: '#ffffff',
        border: '#e5e7eb',
        input: '#e5e7eb',
      },
    },
  },
  plugins: [],
}
