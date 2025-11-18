module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true, // optional
  },
  experimental: {
    applyComplexClasses: true, // ⬅ enables hover/focus in @apply
  },
}
