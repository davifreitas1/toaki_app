import React from 'react';
import { Bell, MessageCircle, User } from 'lucide-react';
import LogoImagem from '../atomos/LogoImagem';

/**
 * Header principal padrão do app.
 *
 * - Usa tokens do global.css para cor de fundo, sombra e raio de borda
 * - Opcionalmente exibe ícones de chat e notificação
 */
const HeaderPrincipal = ({
  logoSrc,
  onAvatarClick,
  mostrarAcoes = false,
  onChatClick,
  onNotificacoesClick,
}) => {
  const handleChat = () => {
    if (onChatClick) onChatClick();
  };

  const handleNotificacoes = () => {
    if (onNotificacoesClick) onNotificacoesClick();
  };

  return (
    <header className="w-full">
      {/* Card do header (igual ao Figma: 92px de altura, raio 16, sombra média) */}
      <div
        className="
          h-[92px]
          bg-[var(--cor-fundo-secundaria)]
          shadow-[var(--sombra-media)]
          rounded-[var(--raio-extra-grande)]
          flex items-center justify-between
          px-4 md:px-6 lg:px-10
        "
      >
        {/* Logo reduzida */}
        <div className="flex items-center">
          <div className="w-[60px] h-[60px]">
            <LogoImagem
              src={logoSrc}
              alt="Logo Tô Aki"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Ações + Avatar */}
        <div className="flex items-center gap-6">
          {mostrarAcoes && (
            <>
              {/* Notificações */}
              <button
                type="button"
                onClick={handleNotificacoes}
                className="
                  hidden md:flex
                  items-center justify-center
                  w-8 h-8
                  rounded-full
                  bg-transparent
                  hover:bg-[var(--cor-preto-hover)]
                  transition-colors
                "
                aria-label="Notificações"
              >
                <Bell
                  size={22}
                  strokeWidth={1.8}
                  className="text-[var(--cor-texto-secundaria)]"
                />
              </button>

              {/* Chat */}
              <button
                type="button"
                onClick={handleChat}
                className="
                  hidden md:flex
                  items-center justify-center
                  w-8 h-8
                  rounded-full
                  bg-transparent
                  hover:bg-[var(--cor-preto-hover)]
                  transition-colors
                "
                aria-label="Chat"
              >
                <MessageCircle
                  size={22}
                  strokeWidth={1.8}
                  className="text-[var(--cor-texto-secundaria)]"
                />
              </button>
            </>
          )}

          {/* Avatar do usuário */}
          <button
            type="button"
            onClick={onAvatarClick}
            className="
              w-12 h-12
              bg-[var(--cor-fundo-secundaria)]
              border border-[var(--cor-borda-neutra)]
              rounded-full
              flex items-center justify-center
              hover:bg-gray-100 transition-colors
            "
            aria-label="Perfil do usuário"
          >
            <User
              size={24}
              strokeWidth={1.8}
              className="text-[var(--cor-texto-secundaria)]"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderPrincipal;
