import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoImagem from '../componentes/atomos/LogoImagem';
import HeaderPrincipal from '../componentes/organismos/HeaderPrincipal';
import FormularioCadastro from '../componentes/organismos/FormularioCadastro';
import Icone from '../componentes/atomos/Icone';
import logoToAki from '../ativos/toaki_logo.png';

const CadastroPagina = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[var(--cor-fundo-primaria)] flex flex-col">
      {/* Header reutilizável (apenas desktop) */}
      <HeaderPrincipal
        logoSrc={logoToAki}
        logoAlt="Tô Aki"
        icones={[
          {
            path: 'usuario',
            onClick: () => {
              console.log('clicou avatar');
            },
            cor: '#777777',
          },
        ]}
        exibirNoMobile={false}
      />

      {/* Conteúdo */}
      <main className="flex-1 flex justify-center items-center px-4 py-6 md:py-10">
        <div className="w-full max-w-[360px] md:max-w-[720px] flex flex-col items-center gap-4">
          {/* Headerzinho do mobile: voltar + logo */}
          <div className="w-full md:hidden pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center gap-2 text-[14px] text-[var(--cor-texto-primaria)]"
            >
              <Icone nome="retorno" tamanho={16} />
              <span>Voltar</span>
            </button>

            <LogoImagem src={logoToAki} className="h-[90px]" />
          </div>

          <FormularioCadastro />
        </div>
      </main>
    </div>
  );
};

export default CadastroPagina;
