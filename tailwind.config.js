/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A0A0F', surface: '#12121A', surface2: '#1C2128',
        teal: '#00C9B1', teal2: '#14B8A8',
        amber: '#C9A84C', amber2: '#D97706',
        oc: '#4A90D9', oc2: '#6EB0F0',
        success: '#1D9E75', danger: '#E24B4A', warn: '#EF9F27',
        muted: '#8A9099', light: '#F0F2F5',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Syne', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
