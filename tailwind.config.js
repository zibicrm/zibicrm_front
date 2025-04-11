/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./Components/**/*.{js,ts,jsx,tsx}",
    "./common/**/*.{js,ts,jsx,tsx}",
    "./Layout/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./data/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        cs: "0px 0px 12px rgba(66, 103, 179, 0.1)",
        btn: "0px 0px 8px rgba(66, 103, 179, 0.5)",
        err: "0px 0px 13px rgba(248, 146, 136, 0.5)",
        box: " 0px 0px 12px rgba(66, 103, 179, 0.1)",
        box2: " 0px 0px 9px rgba(0, 0, 0, 0.22);",
        card : '0px 0px 14px rgba(0,0,0,0.09)'
      },
      borderRadius: {
        cs: "4px",
      },
      backgroundImage: {
        "chat-bg": "url('../public/chat-bg.png')",
        "login-bg": "url('../public/login.png')",
        borderGR:
          "linear-gradient(90deg,#8ea4d1 0%, #8ea4d1 100%, #8ea4d1 0%);",
      },
      screens: {
        desktop: "1440px",
      },
    },
    colors: {
      transparent: "transparent",
      white: "#fff",
      black: "#000",
      warning: "#FF9900",
      zibiPrimary: "#174389",
      primary: {
        50: "#EDF0F8",
        100: "#D9E1F0",
        200: "#C7D2E9",
        300: "#B3C2E1",
        400: "#A1B3D9",
        500: "#8EA4D1",
        600: "#7B95CA",
        700: "#6885C2",
        800: "#5577BB",
        900: "#4267B3",
      },
      gray: {
        50: "#F9FAFB",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D1D5DB",
        400: "#9CA3AF",
        500: "#6B7280",
        600: "#4B5563",
        700: "#374151",
        800: "#1F2937",
        900: "#111827",
      },
      red: {
        50: "#FEF2F2",
        100: "#FEE2E2",
        200: "#FECACA",
        300: "#FCA5A5",
        400: "#F87171",
        500: "#EF4444",
        600: "#DC2626",
        700: "#B91C1C",
      },
      green: {
        50: "#F0FDF4",
        100: "#DCFCE7",
        200: "#BBF7D0",
        300: "#86EFAC",
        400: "#4ADE80",
        500: "#22C55E",
        600: "#16A34A",
        700: "#15803D",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
