import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        text: {
          light: colors.gray[400],
          DEFAULT: colors.gray[700],
          dark: colors.gray[900],
        },
        background: {
          grey: colors.gray[100],
        },
        primary: {
          DEFAULT: colors.blue[600],
          hover: colors.blue[700],
        },
        success: {
          DEFAULT: colors.green[500],
          hover: colors.green[600],
        },
        error: {
          DEFAULT: colors.red[500],
          hover: colors.red[600],
        },
        border: colors.gray[300],
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
