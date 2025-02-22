import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "color": {
          light: colors.gray[400],
          normal: colors.gray[700],
          dark: colors.gray[900],
        },
        "color-background": {
          DEFAULT: colors.gray[200],
        },
        "color-primary": {
          DEFAULT: colors.blue[600],
          hover: colors.blue[700],
        },
        "color-success": {
          DEFAULT: colors.emerald[600],
          hover: colors.emerald[700],
        },
        "color-error": {
          DEFAULT: colors.red[600],
          hover: colors.red[700],
        },
        "color-border": colors.gray[300],
      },
      zIndex: {
        menu: "100",
        overlay: "200",
        modal: "300",
        toast: "400",
        tooltip: "500",
      },
      // boxShadow: {
      //   top: "0 -1px 10px -1px var(--color-shadow)",
      //   bottom: "0 1px 10px -1px var(--color-shadow)",
      // },
    },
  },
} satisfies Config;

export default config;
