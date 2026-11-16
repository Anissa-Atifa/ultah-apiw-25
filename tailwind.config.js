/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#0a0a0c",
        panel: "#12131a",
        neonGreen: "#00ff66",
        hotPink: "#ff007f",
        cyberCyan: "#00f3ff"
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        terminal: ['"VT323"', "monospace"],
        sans: ['"Plus Jakarta Sans"', "sans-serif"]
      },
      boxShadow: {
        neonGreen: "0 0 18px rgba(0, 255, 102, 0.35)",
        hotPink: "0 0 18px rgba(255, 0, 127, 0.38)",
        cyberCyan: "0 0 18px rgba(0, 243, 255, 0.35)"
      }
    }
  },
  plugins: []
};
