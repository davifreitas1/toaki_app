/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marca: {
          primaria: '#F79B4E',   // Laranja
          secundaria: '#0FB5B5', // Ciano (Botão Entrar)
        },
        // Cores específicas solicitadas
        texto: {
          'preto-opaco': 'rgba(0, 0, 0, 0.73)', // #000 73% (Labels e Títulos)
          'link': '#0051FF',                    // #0051FF (Hyperlinks)
          'placeholder': '#D9D9D9',             // Texto dos inputs (placeholder)
        },
        fundo: {
          pagina: '#FFF6E9',      // Bege
          input: '#F9F9F9',       // Fundo dos inputs
          generico: '#D9D9D9',    // Header e Quadrados Sociais
          card: '#FFFFFF',
        },
        borda: {
          generica: '#D9D9D9',    // Bordas dos inputs
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'sm': '14px',   // Links e textos pequenos
        'base': '16px', // Labels e Inputs
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
      },
      // --- Espaçamentos e Tamanhos ---
      spacing: {
        'header': '128px', // Altura do Header solicitada
        'input-h': '41px', // Altura do input (mantida próxima ao padrão)
      },
      // --- Bordas (Radius) ---
      borderRadius: {
        'medio': '8px',   // Inputs
        'login': '30px',  // Card de Login (Exatos 30px pedidos)
        'full': '9999px',
      },
      // --- Sombras ---
      boxShadow: {
        // Sombra média apenas embaixo (offset-y: 4px)
        'cabecalho': '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
        // Sombra grande para o card
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}