import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Mail, Apple } from 'lucide-react';
import TituloSecao from '../atomos/TituloSecao';
import CampoFormulario from '../moleculas/CampoFormulario';
import BotaoPrimario from '../atomos/BotaoPrimario';
import Hyperlink from '../atomos/HyperLink';
import QuadradoRedeSocial from '../atomos/QuadradoRedeSocial';
import DivisorOu from '../moleculas/DivisorOu';
import { useAuth } from '../../contextos/AuthContext';

const FormularioLogin = ({ redirectPath }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    const resultado = await login(email, senha);
    if (resultado?.sucesso) navigate('/app');
    else setErro('Credenciais inválidas');

    if (resultado?.sucesso) {
      const destinoCalculado =
        redirectPath ||
        (resultado.usuario?.tipo_usuario === 'VENDEDOR'
          ? '/vendedor/app'
          : '/app');

      navigate(destinoCalculado, { replace: true });
    } else {
      setErro('Credenciais inválidas');
    }
    setCarregando(false);
  };

  const isVendorFlow = redirectPath === '/vendedor/app' || redirectPath === 'vendedor/app';
  const alternateLink = isVendorFlow
    ? { to: '/login', label: 'Entrar como Cliente' }
    : { to: '/vendedor/login', label: 'Entrar como Vendedor' };
  const cadastroLink = isVendorFlow ? '/vendedor/cadastro' : '/cadastro';

  return (
    <div
      className={`
        relative flex flex-col items-center
        /* --- MOBILE (Base) --- */
        w-[320px]
        min-h-[372px]
        bg-[#F9F9F9]
        rounded-[20px]
        shadow-[0_4px_4px_rgba(0,0,0,0.25)]
        px-7 py-5 pb-6 /* Reduzi padding vertical mobile levemente */

        /* --- DESKTOP (md) --- */
        md:w-[621px]
        md:min-h-[706px]
        md:bg-[rgba(255,255,255,0.85)]
        md:rounded-[30px]
        md:px-[102px]
        md:py-[50px] /* Reduzi de 60px para 50px */
        md:justify-center
      `}
    >
      {/* Título */}
      <TituloSecao className="
        text-[rgba(0,0,0,0.73)] font-semibold mb-5 
        text-[24px] md:text-[48px] md:mb-[40px] /* Reduzi margem inferior */
      ">
        Entrar
      </TituloSecao>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 md:gap-6">
        <CampoFormulario
          label="E-mail"
          id="email"
          type="email"
          placeholder="Ex: joao.silva@exemplo.com.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />

        <div className="flex flex-col gap-1 md:gap-3">
          <CampoFormulario
            label="Senha"
            id="senha"
            type="password"
            placeholder="Ex: MinhaSenhaForte123!"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full"
          />
          
          <div className="flex items-center justify-between mt-1">
            <label className="hidden md:flex items-center gap-2 cursor-pointer select-none">
               <div className="relative flex items-center">
                 <input 
                   type="checkbox" 
                   className="
                     peer appearance-none
                     w-[15px] h-[15px] 
                     border border-black 
                     bg-[#F9F9F9] 
                     checked:bg-[var(--cor-marca-secundaria)]
                     checked:border-transparent
                     transition-all
                   " 
                 />
               </div>
               <span className="text-[14px] font-semibold text-black font-['Montserrat']">
                 Lembrar-me
               </span>
            </label>

            <Hyperlink 
              to="/esqueceu-senha" 
              className="
                font-['Montserrat']
                text-[var(--cor-link-primaria)]
                text-[10px] font-semibold
                md:text-[14px] md:font-semibold
              "
            >
              Esqueceu a senha ?
            </Hyperlink>
          </div>
        </div>

        {erro && <span className="text-red-500 text-xs md:text-sm text-center">{erro}</span>}

        {/* Botão Entrar */}
        <div className="mt-1 md:mt-6"> {/* Reduzi margem top desktop de 42px para mt-6 (~24px) */}
          <BotaoPrimario type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </BotaoPrimario>
        </div>
      </form>

      {/* Link Convidado - Reduzi margens drasticamente */}
      <div className="mt-3 mb-2 md:mt-4 md:mb-6">
        <Hyperlink 
          onClick={() => console.log('Convidado')}
          className="
            text-[var(--cor-link-primaria)] font-['Montserrat']
            text-[12px] font-semibold 
            md:text-[14px] md:font-semibold
          "
        >
          Entrar como Convidado
        </Hyperlink>

        {alternateLink?.to && (
          <div className="mt-2 text-center">
            <Hyperlink
              to={alternateLink.to}
              className="
                text-[var(--cor-link-primaria)] font-['Montserrat']
                text-[12px] font-semibold
                md:text-[14px] md:font-semibold
              "
            >
              {alternateLink.label}
            </Hyperlink>
          </div>
        )}
      </div>

      {/* Divisor "Entrar com" */}
      <div className="w-full mb-3 md:mb-4">
        <DivisorOu />
      </div>

      {/* Botões Sociais - Mais próximos do divisor */}
      <div className="flex gap-3 md:gap-[18px] mb-4 md:mb-8">
        <QuadradoRedeSocial icon={<Facebook />} />
        <QuadradoRedeSocial icon={<Mail />} />
        <QuadradoRedeSocial icon={<Apple />} />
      </div>

      {/* Rodapé - Cadastro */}
      <div className="mt-auto text-[10px] md:text-[16px] font-normal text-black font-['Montserrat']">
        <span>Não tem conta ? </span>
        <Hyperlink to={cadastroLink} className="text-[var(--cor-link-primaria)] font-semibold md:text-[16px]">
          cadastre-se
        </Hyperlink>
      </div>
    </div>
  );
};

export default FormularioLogin;