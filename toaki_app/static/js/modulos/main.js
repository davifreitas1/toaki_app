import { SocketClient } from './socketClient.js';
import { GerenciadorMapa } from './gerenciadorMapa.js';

// Estado da Aplicação
const config = window.TOAKI_CONFIG;
let lastLat = null;
let lastLon = null;
let syncInterval = null;

// Instâncias
const mapa = new GerenciadorMapa('mapa');
const socket = new SocketClient(
    config.WS_URL,
    (data) => processarMensagemSocket(data), // Callback: Ao receber mensagem
    () => aoConectarSocket()                 // Callback: Ao conectar
);

// --- 1. Inicialização ---
// Espera o evento 'google-maps-ready' disparado pelo HTML
window.addEventListener('google-maps-ready', () => {
    mapa.init();
    socket.conectar();
});

// --- 2. Lógica de Processamento (Roteador Frontend) ---
function processarMensagemSocket(data) {
    const action = data.action;
    const payload = data.payload;

    // Caso 1: Atualização em Tempo Real (Push)
    if (action === 'vendedorAtualizado') {
        mapa.atualizarMarcadorTerceiro(payload);
    }
    
    // Caso 2: Lista Completa / Sincronização (Pull)
    else if (action === 'buscarVendedores') {
        if (payload.vendedores && payload.vendedores.features) {
            const lista = payload.vendedores.features;
            
            // A) Atualiza quem veio na lista
            lista.forEach(v => mapa.atualizarMarcadorTerceiro(v));
            
            // B) Remove quem NÃO veio (Fantasmas)
            mapa.limparFantasmas(lista);
        }
    }
}

// --- 3. Lógica de GPS e Ciclo de Vida ---
function aoConectarSocket() {
    updateStatus("Online!");
    iniciarRastreamentoGPS();
    iniciarBuscaVendedores();
}

function iniciarRastreamentoGPS() {
    if (!navigator.geolocation) {
        alert("Geolocalização não suportada.");
        return;
    }

    const geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    navigator.geolocation.watchPosition(
        (pos) => {
            lastLat = pos.coords.latitude;
            lastLon = pos.coords.longitude;

            // 1. Atualiza visualmente (Feedback instantâneo)
            mapa.atualizarMeuMarcador(lastLat, lastLon);

            // 2. Envia para o servidor (Push)
            socket.enviar('atualizarLocalizacao', {
                lat: lastLat,
                lon: lastLon
            });
        },
        (err) => console.error("Erro GPS:", err),
        geoOptions
    );
}

function iniciarBuscaVendedores() {
    // Garante que só existe um loop rodando
    if (syncInterval) clearInterval(syncInterval);

    // A cada 5 segundos, faz a "chamada" para limpar fantasmas
    syncInterval = setInterval(() => {
        if (lastLat && lastLon) {
            socket.enviar('buscarVendedores', {
                lat: lastLat,
                lon: lastLon,
                raioKm: 1
            });
        }
    }, 5000);
}

// Utilitário UI
function updateStatus(msg) {
    const el = document.getElementById("status");
    if (el) el.innerText = msg;
}