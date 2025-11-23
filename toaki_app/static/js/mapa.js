/**
 * ============================================================
 * MÓDULO 1: GERENCIADOR DE MAPA (Responsabilidade Única: Renderizar)
 * ============================================================
 */

class GerenciadorMapa {
    constructor(idElemento) {
        this.mapa = null;
        this.marcadores = new Map(); // Armazena referências aos marcadores por ID
        this.elementoMapa = document.getElementById(idElemento);
        this.iconePadrao = "https://maps.google.com/mapfiles/ms/icons/red-dot.png"; // Ícone Vendedor
        this.iconeUsuario = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"; // Ícone Cliente
    }

    async inicializar(latitudeInicial, longitudeInicial) {
        // Importação dinâmica da biblioteca (Google Maps Moderno)
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        this.mapa = new Map(this.elementoMapa, {
            center: { lat: latitudeInicial, lng: longitudeInicial },
            zoom: 15,
            mapId: "DEMO_MAP_ID", // Necessário para AdvancedMarkerElement
            disableDefaultUI: false,
            zoomControl: true,
        });

        // Adiciona o marcador do próprio usuário (azul)
        this._criarMarcador("usuario_atual", latitudeInicial, longitudeInicial, "Você", this.iconeUsuario);
    }

    atualizarPosicaoVendedor(id, nome, lat, lon) {
        if (this.marcadores.has(id)) {
            this._moverMarcador(id, lat, lon);
        } else {
            this._criarMarcador(id, lat, lon, nome, this.iconePadrao);
        }
    }

    removerVendedor(id) {
        if (this.marcadores.has(id)) {
            const marcador = this.marcadores.get(id);
            marcador.map = null; // Remove do mapa
            this.marcadores.delete(id);
        }
    }

    // --- Métodos Privados (Encapsulamento) ---

    _criarMarcador(id, lat, lon, titulo, urlIcone) {
        // Cria um elemento de imagem para o ícone personalizado
        const img = document.createElement("img");
        img.src = urlIcone;
        
        const marcador = new google.maps.marker.AdvancedMarkerElement({
            map: this.mapa,
            position: { lat: lat, lng: lon },
            title: titulo,
            content: img
        });

        this.marcadores.set(id, marcador);
    }

    _moverMarcador(id, lat, lon) {
        const marcador = this.marcadores.get(id);
        if (marcador) {
            // Animação suave poderia ser implementada aqui
            marcador.position = { lat: lat, lng: lon };
        }
    }
}

/**
 * ============================================================
 * MÓDULO 2: SERVIÇO WEBSOCKET (Responsabilidade Única: Comunicação)
 * ============================================================
 */

class ServicoWebSocket {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.callbacks = {
            aoReceberMensagem: () => {},
            aoConectar: () => {},
            aoDesconectar: () => {}
        };
        this.tentativasReconexao = 0;
    }

    conectar() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("✅ WebSocket Conectado");
            this.tentativasReconexao = 0;
            this.callbacks.aoConectar();
        };

        this.socket.onmessage = (evento) => {
            const dados = JSON.parse(evento.data);
            this.callbacks.aoReceberMensagem(dados);
        };

        this.socket.onclose = () => {
            console.warn("⚠️ WebSocket Desconectado. Tentando reconectar...");
            this.callbacks.aoDesconectar();
            this._tentarReconectar();
        };

        this.socket.onerror = (erro) => {
            console.error("❌ Erro no WebSocket:", erro);
        };
    }

    enviar(dados) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(dados));
        } else {
            console.error("Tentativa de envio sem conexão ativa.");
        }
    }

    definirCallbacks(aoReceber, aoConectar, aoDesconectar) {
        this.callbacks.aoReceberMensagem = aoReceber;
        this.callbacks.aoConectar = aoConectar;
        this.callbacks.aoDesconectar = aoDesconectar;
    }

    _tentarReconectar() {
        // Backoff exponencial simples para reconexão (evita floodar o servidor)
        const tempoEspera = Math.min(5000, (this.tentativasReconexao * 1000) + 1000);
        setTimeout(() => {
            this.tentativasReconexao++;
            this.conectar();
        }, tempoEspera);
    }
}

/**
 * ============================================================
 * MÓDULO 3: CONTROLADOR DA APLICAÇÃO (O Maestro)
 * ============================================================
 */

class AppToAki {
    constructor() {
        this.gerenciadorMapa = new GerenciadorMapa("container-mapa");
        
        // Define protocolo wss:// (seguro) se estiver em https, ou ws:// se http
        const protocolo = window.location.protocol === "https:" ? "wss://" : "ws://";
        const urlSocket = `${protocolo}${window.location.host}/ws/mapa/`;
        
        this.socket = new ServicoWebSocket(urlSocket);
        this.avisoElemento = document.getElementById("aviso-status");
    }

    async iniciar() {
        this._mostrarStatus("Obtendo sua localização...", "normal");

        try {
            const posicao = await this._obterLocalizacaoUsuario();
            const { latitude, longitude } = posicao.coords;

            // 1. Inicializa o Mapa
            await this.gerenciadorMapa.inicializar(latitude, longitude);

            // 2. Configura o Socket
            this.socket.definirCallbacks(
                (dados) => this._processarMensagemSocket(dados), // Ao Receber
                () => this._aoConectarSocket(latitude, longitude), // Ao Conectar
                () => this._mostrarStatus("Desconectado. Reconectando...", "offline") // Ao Cair
            );

            // 3. Conecta
            this.socket.conectar();

        } catch (erro) {
            console.error(erro);
            this._mostrarStatus("Erro ao obter localização. Verifique as permissões.", "offline");
        }
    }

    // --- Lógica de Negócio ---

    _obterLocalizacaoUsuario() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) reject("Geolocalização não suportada.");
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    _aoConectarSocket(lat, lon) {
        this._mostrarStatus("Conectado em tempo real", "online");
        
        // Envia a localização atual para entrar no grupo do Geohash correto
        this.socket.enviar({
            type: "user_location",
            lat: lat,
            lon: lon
        });
    }

    _processarMensagemSocket(payload) {
        // Padrão Strategy poderia ser usado aqui se houvessem muitos tipos
        
        if (payload.type === "initial_providers") {
            // Carga inicial de vendedores
            console.log(`Carregando ${payload.providers.features.length} vendedores próximos.`);
            payload.providers.features.forEach(vendedor => {
                // O GeoJSON serializer retorna [lon, lat] em 'coordinates'
                const [lon, lat] = vendedor.geometry.coordinates;
                this.gerenciadorMapa.atualizarPosicaoVendedor(
                    vendedor.id, 
                    vendedor.properties.nome, 
                    lat, 
                    lon
                );
            });
        } 
        else if (payload.type === "provider_update") {
            // Atualização em tempo real de um vendedor
            console.log(`Atualização recebida: ${payload.nome}`);
            this.gerenciadorMapa.atualizarPosicaoVendedor(
                payload.id,
                payload.nome,
                payload.lat,
                payload.lon
            );
        }
    }

    _mostrarStatus(texto, tipo) {
        this.avisoElemento.innerText = texto;
        this.avisoElemento.style.display = "block";
        this.avisoElemento.className = "aviso-flutuante status-" + tipo;
        
        // Oculta status 'online' após 3 segundos para limpar a tela
        if (tipo === "online") {
            setTimeout(() => { this.avisoElemento.classList.toggle("esconder") }, 3000);
        }
    }
}

// --- Ponto de Entrada (Main) ---
// Função chamada pelo callback do script do Google Maps
function iniciarApp() {
    const app = new AppToAki();
    app.iniciar();
}