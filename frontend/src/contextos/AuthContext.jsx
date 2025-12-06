// src/contextos/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUsuario, verificarAuth } from '../servicos/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Checa no carregamento se já existe sessão válida (cookie)
  useEffect(() => {
    const checarAuth = async () => {
      try {
        const estaAutenticado = await verificarAuth();
        setAutenticado(estaAutenticado);
      } catch (erro) {
        console.error('Erro ao verificar autenticação:', erro);
        setAutenticado(false);
      } finally {
        setCarregando(false);
      }
    };

    checarAuth();
  }, []);

  // Faz login usando o serviço de auth
  const login = async (username, password) => {
    const resultado = await loginUsuario(username, password);

    // Aqui assumo que loginUsuario retorna { sucesso: boolean, dados/erro }
    // Ajuste se sua função retornar algo diferente.
    if (resultado?.sucesso) {
      setAutenticado(true);
    } else {
      setAutenticado(false);
    }

    return resultado;
  };

  // Opcional: quando você tiver um endpoint /logout/, você pode chamar aqui
  const logout = async () => {
    // TODO: chamar API de logout se existir
    setAutenticado(false);
  };

  const valorContexto = {
    autenticado,
    carregando,
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
