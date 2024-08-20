const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "feature/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "base-color": "var(--base-color)",
        // 👇デフォルト
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "scale-in-hor-right": {
          "0%": {
            transform: "scaleX(0)",
            "transform-origin": "100% 100%",
            opacity: "1",
          },
          to: {
            transform: "scaleX(1)",
            "transform-origin": "100% 100%",
            opacity: "1",
          },
        },
        "scale-out-hor-right": {
          "0%": {
            transform: "scaleX(1)",
            "transform-origin": "100% 100%",
            opacity: "1",
          },
          to: {
            transform: "scaleX(0)",
            "transform-origin": "100% 100%",
            opacity: "1",
          },
        },
        "slide-in-fwd-right": {
          "0%": {
            transform: "translateZ(-1400px) translateX(1000px)",
            opacity: "0",
          },
          to: {
            transform: "translateZ(0) translateX(0)",
            opacity: "1",
          },
        },
        "slide-out-fwd-right": {
          "0%": {
            transform: "translateZ(0) translateX(0)",
            opacity: "1",
          },
          to: {
            transform: "translateZ(600px) translateX(400px)",
            opacity: "0",
          },
        },
        "slide-in-bck-center": {
          "0%": {
            transform: "translateZ(600px)",
            opacity: "0",
          },
          to: {
            transform: "translateZ(0)",
            opacity: "1",
          },
        },
        "slide-out-bck-center": {
          "0%": {
            transform: "translateZ(0)",
            opacity: "1",
          },
          to: {
            transform: "translateZ(-1100px)",
            opacity: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scale-in-hor-right":
          "scale-in-hor-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        "scale-out-hor-right":
          "scale-out-hor-right 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both",
        "slide-in-fwd-right":
          "slide-in-fwd-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        "slide-out-fwd-right":
          "slide-out-fwd-right 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both",
        "slide-in-bck-center":
          "slide-in-bck-center 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        "slide-out-bck-center":
          "slide-out-bck-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both",
      },
      // 追加
      boxShadow: {
        shadow: "var(--shadow)",
      },
    },
  },
  plugins: [require("tailwindcss-animate", "@tailwindcss/line-clamp")],
}
