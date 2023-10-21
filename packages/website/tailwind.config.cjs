const config = require("@xhyrom/configs/tailwind.config");

/** @type {import('tailwindcss').Config} */
export default {
  ...config.default({
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  }),
  plugins: [],
};
