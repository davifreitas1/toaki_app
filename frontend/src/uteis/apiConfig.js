// src/uteis/apiConfig.js

const HOST_API = import.meta.env.VITE_API_URL;

// Verifica se é HTTPS (seguro) para definir WSS ou WS
const ehSeguro = window.location.protocol === 'https:';

const PROTOCOLOS = {
    HTTP: ehSeguro ? 'https' : 'http',
    WS: ehSeguro ? 'wss' : 'ws',
};

export const obterUrlHttp = (caminho) => {
    return `${PROTOCOLOS.HTTP}://${HOST_API}${caminho}`;
};

export const obterUrlWs = (caminho) => {
    return `${PROTOCOLOS.WS}://${HOST_API}${caminho}`;
};