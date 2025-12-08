import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TituloSecao from '../atomos/TituloSecao';
import CampoFormulario from '../moleculas/CampoFormulario';
import BotaoPrimario from '../atomos/BotaoPrimario';
import Hyperlink from '../atomos/Hyperlink';
import QuadradoRedeSocial from '../atomos/QuadradoRedeSocial';
import { useAuth } from '../../contextos/AuthContext';

const FormularioLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    setCarregando(true);
    setErro('');

    const resultado = await login(email, senha);

    if (resultado?.sucesso) {
      navigate('/app');
    } else {
      setErro('Email ou senha inválidos.');
    }

    setCarregando(false);
  };

  const handleEntrarConvidado = () => {
    console.log('Entrar como convidado');
  };

  return (
    <section
      className="
        w-full
        bg-[var(--cor-branco-generico)]
        rounded-[30px]
        shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        px-6
        py-6
        md:px-14
        md:py-10
      "
    >
      <TituloSecao className="mb-6 md:mb-8">Entrar</TituloSecao>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <CampoFormulario
          label="E-mail"
          id="email"
          type="email"
          placeholder="Ex: joao.silva@exemplo.com.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="space-y-2">
          <CampoFormulario
            label="Senha"
            id="senha"
            type="password"
            placeholder="Ex: MinhaSenhaForte123!"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <label
              className="
                flex items-center gap-2
                text-[12px] md:text-[16px]
                text-[var(--cor-texto-primaria)]
              "
            >
              <input
                type="checkbox"
                className="
                  w-3 h-3 md:w-4 md:h-4
                  accent-[var(--cor-marca-secundaria)]
                "
              />
              <span>Lembrar-me</span>
            </label>

            <Hyperlink to="/esqueceu-senha">
              Esqueceu a senha ?
            </Hyperlink>
          </div>
        </div>

        {erro && (
          <p className="text-[11px] md:text-[12px] text-[var(--cor-feedback-negativo)]">
            {erro}
          </p>
        )}
        
        <div className="flex justify-center pt-2">
          <BotaoPrimario type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </BotaoPrimario>
        </div>
      </form>

      <div className="mt-4 text-center">
        <Hyperlink
          onClick={handleEntrarConvidado}
          className="font-[var(--font-Medium)]"
        >
          Entrar como Convidado
        </Hyperlink>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span className="flex-1 h-px bg-[var(--cor-borda-neutra)]" />
        <span
          className="
            text-[12px] md:text-[16px]
            text-[var(--cor-texto-secundaria)]
          "
        >
          Entrar com
        </span>
        <span className="flex-1 h-px bg-[var(--cor-borda-neutra)]" />
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <QuadradoRedeSocial />
        <QuadradoRedeSocial />
        <QuadradoRedeSocial />
      </div>

      <div className="mt-6 text-center text-[12px] md:text-[16px]">
        <span className="text-[var(--cor-preto-texto)]">
          Não tem conta ?
        </span>{' '}
        <Hyperlink to="/cadastro">cadastre-se</Hyperlink>
      </div>
    </section>
  );
};

export default FormularioLogin;
