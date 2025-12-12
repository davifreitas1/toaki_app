import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contextos/AuthContext';

const BotaoLogoutTemporario = ({ classeExtra = '' }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState(null);

  const handleLogout = async () => {
    if (saindo) return;

    setSaindo(true);
    setErro(null);

    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error('Falha ao sair (temporário):', e);
      setErro('Não foi possível sair agora.');
    } finally {
      setSaindo(false);
    }
  };

  return (
    <div className={`flex flex-col items-end gap-1 ${classeExtra}`}>
      <button
        type="button"
        onClick={handleLogout}
        className="
          inline-flex items-center gap-2
          rounded-full
          bg-[var(--cor-fundo-secundaria)]
          px-3 py-2 text-xs font-semibold
          text-[var(--cor-texto-primaria)]
          shadow-[var(--sombra-media)]
          border border-[var(--cor-borda-neutra)]
          hover:bg-white transition-colors
        "
        aria-label="Sair da conta (temporário)"
        disabled={saindo}
      >
        <span className="leading-none">Logout</span>
        {saindo && (
          <span className="text-[10px] text-[var(--cor-texto-secundaria)]">
            ...
          </span>
        )}
      </button>

      {erro && (
        <span className="text-[10px] text-red-600 bg-white/80 rounded px-2 py-1 shadow-sm">
          {erro}
        </span>
      )}
    </div>
  );
};

export default BotaoLogoutTemporario;