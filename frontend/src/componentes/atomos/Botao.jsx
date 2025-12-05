import React from 'react';

const Botao = ({ children, variante = 'primario', aoClicar, tipo = 'button', classeExtra = '' }) => {
  const base = "w-full transition-all duration-300 font-semibold text-sm flex items-center justify-center";
  
  const estilos = {
    // Ciano (#0FB5B5) com texto branco, arredondado e sombra
    primario: "bg-marca-secundaria text-white py-3 rounded-input shadow-suave hover:brightness-95 hover:shadow-media",
    
    // Texto Azul/Ciano para "Entrar como convidado"
    link: "bg-transparent text-blue-600 hover:text-blue-800 py-2",
    
    // Apenas texto cinza/azul para links pequenos
    texto: "bg-transparent text-blue-500 text-xs font-medium hover:underline p-0 w-auto"
  };

  return (
    <button 
      type={tipo} 
      onClick={aoClicar} 
      className={`${base} ${estilos[variante]} ${classeExtra}`}
    >
      {children}
    </button>
  );
};

export default Botao;