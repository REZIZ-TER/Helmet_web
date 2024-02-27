/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/*.{html,js}",
    "./dist/*.{html,js}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    // themes: ["nord","dim"]
    themes:[
      {
        nord:{
          ...require("daisyui/src/theming/themes")["nord"],
          "info":"#06b6d4"
        },
      }
    ]
  }
}