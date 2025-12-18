/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00F0FF",
        secondary: "#7B2FFF",
        accent: "#FF00E5",
        dark: {
          900: "#0A0A0F",
          800: "#12121A",
          700: "#1A1A25",
          600: "#252532",
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        gradient: "gradient 8s ease infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.8s ease-out",
        "bounce-slow": "bounce-slow 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
          "50%": { transform: "translateX(-50%) translateY(-8px)" },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

