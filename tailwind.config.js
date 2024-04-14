/** @type {import('tailwindcss').Config} */
export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
  extend: {
    colors: {
      black: "#302f2f", // Your primary color
      secondary: "#FACC15", // Your secondary color
      // Add more colors as needed
    },
  },
};
export const plugins = [];
// tailwind.config.js
