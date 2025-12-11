import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Mail, Apple, ChevronLeft } from 'lucide-react';
import TituloSecao from '../atomos/TituloSecao';
import CampoFormulario from '../moleculas/CampoFormulario';
import BotaoPrimario from '../atomos/BotaoPrimario';
import QuadradoRedeSocial from '../atomos/QuadradoRedeSocial';
import DivisorOu from '../moleculas/DivisorOu';
import { registrarVendedor } from '../../servicos/auth';

const FormularioCadastroVendedor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nomeFantasia: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    if (erro) setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (form.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!form.nomeFantasia.trim()) {
      setErro('Informe o nome fantasia do vendedor.');
      return;
    }

    setCarregando(true);

    const resultado = await registrarVendedor({
      nomeFantasia: form.nomeFantasia,
      email: form.email,
      senha: form.senha,
    });

    if (resultado.sucesso) {
      alert('Cadastro de vendedor criado com sucesso!');
      navigate('/vendedor/login');
    } else {
      setErro(
        resultado.erro || 'Erro ao realizar cadastro de vendedor. Tente novamente.',
      );
    }

    setCarregando(false);
  };

  return (
    <div
      className={`
        relative flex flex-col items-center
        w-[320px]
        bg-[#F9F9F9]
        rounded-[20px]
        shadow-[0_4px_4px_rgba(0,0,0,0.25)]
        px-7 py-6 pb-8

        md:w-[621px]
        md:bg-[rgba(255,255,255,0.85)]
        md:rounded-[30px]
        md:px-[102px]
        md:py-[50px]
        md:justify-center
      `}
    >
      <button
        onClick={() => navigate(-1)}
        className="
          hidden md:flex
          absolute
          top-[30px] left-[30px]
          items-center gap-1
          text-[16px] font-semibold font-['Montserrat']
          text-black hover:opacity-70
        "
      >
        <ChevronLeft size={24} />
        Voltar
      </button>

      <TituloSecao
        className="
          text-[rgba(0,0,0,0.73)] font-medium mb-6
          text-[24px] md:text-[48px] md:mb-[40px]
        "
      >
        Cadastrar
      </TituloSecao>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 md:gap-5">
        <CampoFormulario
          label="Nome fantasia"
          id="nomeFantasia"
          placeholder="Ex: Sorvetes do João"
          value={form.nomeFantasia}
          onChange={handleChange}
          className="w-full"
        />

        <CampoFormulario
          label="E-mail"
          id="email"
          type="email"
          placeholder="Ex: contato@sorvetesjoao.com"
          value={form.email}
          onChange={handleChange}
          className="w-full"
        />

        <CampoFormulario
          label="Senha"
          id="senha"
          type="password"
          placeholder="Ex: MinhaSenhaForte123!"
          value={form.senha}
          onChange={handleChange}
          className="w-full"
        />

        <CampoFormulario
          label="Confirmar Senha"
          id="confirmarSenha"
          type="password"
          placeholder="Repita sua senha"
          value={form.confirmarSenha}
          onChange={handleChange}
          className="w-full"
        />

        {erro && <span className="text-red-500 text-xs md:text-sm text-center">{erro}</span>}

        <div className="mt-2 md:mt-6">
          <BotaoPrimario type="submit" disabled={carregando}>
            {carregando ? 'Registrando...' : 'Registrar'}
          </BotaoPrimario>
        </div>
      </form>

      <div className="w-full mt-4 mb-3 md:mt-6 md:mb-4">
        <DivisorOu />
      </div>

      <div className="flex gap-3 md:gap-[18px] mb-2 md:mb-0">
        <QuadradoRedeSocial icon={<Facebook />} />
        <QuadradoRedeSocial icon={<Mail />} />
        <QuadradoRedeSocial icon={<Apple />} />
      </div>
    </div>
  );
};

export default FormularioCadastroVendedor;