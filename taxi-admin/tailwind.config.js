/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "circular-gradient": "radial-gradient(circle, #02172D, #080c13)",
      },
    },
  },
  plugins: [],
};
