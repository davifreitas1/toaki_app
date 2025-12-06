import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TituloSecao from '../atomos/TituloSecao';
import CampoFormulario from '../moleculas/CampoFormulario';
import BotaoPrimario from '../atomos/BotaoPrimario';
import QuadradoRedeSocial from '../atomos/QuadradoRedeSocial';
import { registrarUsuario } from '../../servicos/auth';
import Icone from '../atomos/Icone';

const FormularioCadastro = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(false);

  const validar = () => {
    const novoErros = {};

    if (!nome.trim()) {
      novoErros.nome = 'Informe seu nome completo.';
    }

    if (!email.trim()) {
      novoErros.email = 'Informe um e-mail.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      novoErros.email = 'Informe um e-mail válido.';
    }

    if (!senha) {
      novoErros.senha = 'Informe uma senha.';
    } else if (senha.length < 8) {
      novoErros.senha = 'Use pelo menos 8 caracteres.';
    }

    if (!confirmarSenha) {
      novoErros.confirmarSenha = 'Confirme sua senha.';
    } else if (confirmarSenha !== senha) {
      novoErros.confirmarSenha = 'As senhas não coincidem.';
    }

    return novoErros;
  };

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    setErroGeral('');

    const novoErros = validar();
    setErros(novoErros);

    if (Object.keys(novoErros).length > 0) {
      return;
    }

    setCarregando(true);

    const resultado = await registrarUsuario({ nome, email, senha });

    if (resultado?.sucesso) {
      // você pode trocar para logar automaticamente aqui se quiser
      navigate('/login');
    } else {
      const mensagem =
        resultado?.dados?.detail ||
        'Não foi possível criar sua conta. Tente novamente.';
      setErroGeral(mensagem);
    }

    setCarregando(false);
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
      {/* Seta de voltar apenas no desktop (fica dentro do card) */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="
          hidden md:inline-flex
          items-center justify-center
          w-8 h-8
          rounded-full
          hover:bg-[var(--cor-fundo-primaria)]
          mb-4
        "
        aria-label="Voltar"
      >
        <Icone nome="retorno" tamanho={16} />
      </button>

      <TituloSecao className="mb-6 md:mb-8 text-center">
        Criar Conta
      </TituloSecao>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <CampoFormulario
          label="Nome"
          id="nome"
          placeholder="Ex: João da Silva"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          erro={erros.nome}
        />

        <CampoFormulario
          label="E-mail"
          id="email"
          type="email"
          placeholder="Ex: joao.silva@exemplo.com.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          erro={erros.email}
        />

        <CampoFormulario
          label="Senha"
          id="senha"
          type="password"
          placeholder="Ex: MinhaSenhaForte123!"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          erro={erros.senha}
        />

        <CampoFormulario
          label="Senha"
          id="confirmar-senha"
          type="password"
          placeholder="Repita a senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          erro={erros.confirmarSenha}
        />

        {erroGeral && (
          <p className="text-[11px] md:text-[12px] text-[var(--cor-feedback-negativo)]">
            {erroGeral}
          </p>
        )}

        <div className="flex justify-center pt-2">
          <BotaoPrimario type="submit" disabled={carregando}>
            {carregando ? 'Registrando...' : 'Registrar'}
          </BotaoPrimario>
        </div>
      </form>

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
    </section>
  );
};

export default FormularioCadastro;
