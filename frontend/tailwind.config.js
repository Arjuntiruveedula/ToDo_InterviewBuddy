/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        "foundation-brand-brand-50": "#ebeefc",
        "foundation-brand-brand-500": "#3659e2",
        "foundation-text-colors-primary-text-color": "#232323",
        "foundation-success-success-50": "#e7f8e9",
        "foundation-success-success-500": "#12bb23",
        "secondary-colour-blue-blue-50": "#eff8ff",
        "foundation-info-info-500": "#3fa1e3",
        "foundation-info-info-50": "#ecf6fc",
        "secondary-colour-pink-pink-50": "#fdf2fa",
        "secondary-colour-pink-pink-500": "#ee46bc",
        "foundation-warning-warning-50": "#feefe6",
        "foundation-warning-warning-600": "#db5800",
      },
      spacing: {},
      fontFamily: {
        "typography-styles-heading-6-bold": "'Nunito Sans'",
      },
      borderRadius: {
        xl: "20px",
      },
    },
    fontSize: {
      xs: "12px",
      base: "16px",
      lg: "18px",
      inherit: "inherit",
    },
  },
  corePlugins: {
    preflight: false,
  },
};
