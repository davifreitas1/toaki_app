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
    // aqui você pode implementar sua lógica de convidado
    console.log('Entrar como convidado');
  };

  return (
    <section
      className="
        w-full
        bg-[var(--cor-branco-generico)]
        rounded-[var(--radius-lg)]
        shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        px-6
        py-5   /* era py-6 */
      "
    >
      <TituloSecao className="mb-4">Entrar</TituloSecao>  {/* era mb-6 */}

      <form onSubmit={handleSubmit} className="space-y-3"> {/* era space-y-4 */}
        <CampoFormulario
          label="Email"
          id="email"
          type="email"
          placeholder="Ex: joao.silva@exemplo.com.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="space-y-1">
          <CampoFormulario
            label="Senha"
            id="senha"
            type="password"
            placeholder="Ex: MinhaSenhaForte123!"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <div className="flex justify-end">
            <Hyperlink to="/esqueceu-senha">
              Esqueceu a senha ?
            </Hyperlink>
          </div>
        </div>

        {erro && (
          <p className="text-[var(--font-size-xs)] text-[var(--cor-feedback-negativo)]">
            {erro}
          </p>
        )}

        <div className="flex justify-center">
          <BotaoPrimario type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </BotaoPrimario>
        </div>
      </form>

      {/* Entrar como convidado */}
      <div className="mt-4 text-center">
        <Hyperlink onClick={handleEntrarConvidado} className="font-[var(--font-Medium)]">
          Entrar como Convidado
        </Hyperlink>
      </div>

      {/* Separador "Entrar com" */}
      <div className="mt-4 flex items-center gap-2">
        <span className="flex-1 h-px bg-[var(--cor-borda-neutra)]" />
        <span className="text-[var(--font-size-xs)] text-[var(--cor-texto-secundaria)]">
          Entrar com
        </span>
        <span className="flex-1 h-px bg-[var(--cor-borda-neutra)]" />
      </div>

      {/* Quadrados de redes sociais */}
      <div className="mt-3 flex justify-center gap-3">
        <QuadradoRedeSocial />
        <QuadradoRedeSocial />
        <QuadradoRedeSocial />
      </div>

      {/* Link de cadastro */}
      <div className="mt-5 text-center text-[var(--font-size-xs)]">
        <span className="text-[var(--cor-preto-texto)]">
          Não tem conta ?
        </span>{' '}
        <Hyperlink to="/cadastro">cadastre-se</Hyperlink>
      </div>
    </section>
  );
};

export default FormularioLogin;
