export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: { 50: "#FAF6EE", 100: "#F3EDE2", 200: "#E8DCC8" },
        ink:   { 900: "#0F131D", 800: "#161B28", 700: "#232A3A" }
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans:  ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        book: "0 18px 40px -18px rgba(0,0,0,.45)",
        bookHover: "0 36px 70px -22px rgba(0,0,0,.55)"
      }
    }
  },
  plugins: []
};
