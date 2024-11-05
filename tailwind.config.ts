import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#FFFFFF',
          dark: '#17101F',
        },
        messagebox: {
          light: '#F6F6F6',
          dark: '#1F1827',
        },
        button: {
          primary: {
            DEFAULT: '#7C65C1',
            hover: '#6A44BB',
          },
          secondary: {
            light: {
              DEFAULT: '#E8E9EB',
              hover: '#D7D7D8',
            },
            dark: {
              DEFAULT: '#443664',
              hover: '#5F4D91',
            },
          },
        },
        text: {
          light: {
            primary: '#24292F',
            secondary: '#546473',
            tertiary: '#7C65C1',
          },
          dark: {
            primary: '#FFFFFF',
            secondary: '#9FA3AF',
            tertiary: '#C848FF',
          },
        },
      },
      fontFamily: {
        sans: [
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
