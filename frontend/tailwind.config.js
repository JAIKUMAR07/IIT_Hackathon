/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#667eea",
          dark: "#764ba2",
        },
        accent: {
          DEFAULT: "#f093fb",
          pink: "#f5576c",
        },
        success: "#43e97b",
        info: "#4facfe",
        warning: "#feca57",
        danger: "#ff6b6b",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
