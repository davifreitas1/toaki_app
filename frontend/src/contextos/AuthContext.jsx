// src/contextos/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUsuario, verificarAuth } from '../servicos/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState(null);

  // Checa no carregamento se já existe sessão válida (cookie)
  useEffect(() => {
    const checarAuth = async () => {
      try {
        const { autenticado: estaAutenticado, usuario: usuarioAtual } =
          await verificarAuth();

        setAutenticado(estaAutenticado);
        setUsuario(usuarioAtual);
      } catch (erro) {
        console.error('Erro ao verificar autenticação:', erro);
        setAutenticado(false);
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    };

    checarAuth();
  }, []);

  // Faz login usando o serviço de auth e já carrega o perfil completo
  const login = async (username, password) => {
    const resultado = await loginUsuario(username, password);

    if (resultado?.sucesso) {
      const {
        autenticado: estaAutenticado,
        usuario: usuarioLogado,
      } = await verificarAuth();

      setAutenticado(estaAutenticado);
      setUsuario(usuarioLogado);
      return { ...resultado, usuario: usuarioLogado };
    }

    return resultado;
  };

  const logout = async () => {
    // TODO: chamar API de logout quando existir
    setAutenticado(false);
    setUsuario(null);
  };

  const valorContexto = {
    autenticado,
    carregando,
    usuario,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={valorContexto}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de forma simples
export const useAuth = () => {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de um <AuthProvider>.');
  }

  return contexto;
};
