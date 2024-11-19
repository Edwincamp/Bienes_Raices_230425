/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF', // Blanco
        black: '#000000', // Negro
        blue: '#95B4D5', // Azul claro
        red: '#F75555', // Rojo
        green: '#93E16A', // Verde
      },
    },
  },
  plugins: [],
}

