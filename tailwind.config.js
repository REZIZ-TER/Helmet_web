/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/*.{html,js}",
    "./dist/*.{html,js}"
  ],
  theme: {
    extend: {},
    screens: {
      'sm': {'min': '300px', 'max': '767px'},
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    }
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
