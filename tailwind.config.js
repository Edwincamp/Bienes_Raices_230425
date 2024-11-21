/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF', // Blanco
        primaryText: '#000000', // Negro
        formBackground: '#95B4D5', // Azul claro
        action:'#F75555', // Rojo
        secondaryText: '#93E16A', // Verde
        hoverAction: '#93E16A', 
      },
    },
  },
  plugins: [],
}

