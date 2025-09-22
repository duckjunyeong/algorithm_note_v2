/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
     "../../libs/ui-components/src/**/*.{js,jsx,ts,tsx}",],
   theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#5E6AD2",
          light: "#7B83EB",
          dark: "#4C5AA8"
        },
        neutral: {
          black: "#0D0E10",
          900: "#16181D",
          800: "#1C1F26",
          700: "#22252C",
          600: "#2A2D34",
          500: "#35393F",
          400: "#4E5158",
          300: "#6B7280",
          100: "#D1D5DB",
          50: "#F3F4F6",
          white: "#FFFFFF"
        },
        semantic: {
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#3B82F6"
        },
        background: {
          primary: "#FAFBFC",
          secondary: "#FFFFFF",
          tertiary: "#F8F9FA",
          paper: "#e5dfd5",
        },
        text: {
          primary: "#0D0E10",
          secondary: "#6B7280",
          tertiary: "#9CA3AF",
          inverse: "#FFFFFF"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        mono: ["'SF Mono'", "Monaco", "'Cascadia Code'", "'Roboto Mono'", "Consolas", "'Courier New'", "monospace"]
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "30px",
        "4xl": "36px",
        "5xl": "48px",
        "6xl": "64px"
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700"
      },
      lineHeight: {
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2"
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
        "32": "128px"
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px"
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }
    },
  },
  plugins: [],
}