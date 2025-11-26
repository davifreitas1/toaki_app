export class GerenciadorMapa {
    constructor(elementId) {
        this.elementId = elementId;
        this.map = null;
        this.markers = {}; // Cache: { id: AdvancedMarkerElement }
        this.myMarker = null;
        this.config = window.TOAKI_CONFIG || {};
        
        // Armazenaremos a classe aqui após importar
        this.AdvancedMarkerElement = null; 
        this.PinElement = null;
    }

    async init() {
        console.log("Inicializando Google Maps...");
        
        // 1. Importação Dinâmica das Bibliotecas
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
        
        this.AdvancedMarkerElement = AdvancedMarkerElement;
        this.PinElement = PinElement;

        // 2. Criação do Mapa
        this.map = new Map(document.getElementById(this.elementId), {
            center: { lat: -23.5505, lng: -46.6333 },
            zoom: 15,
            disableDefaultUI: false,
            // CRITICO: AdvancedMarkers exigem um Map ID. 
            // Use "DEMO_MAP_ID" para testes ou crie um no Google Cloud Console.
            mapId: "DEMO_MAP_ID" 
        });
    }

    /**
     * Cria a estrutura HTML para o marcador (Texto + Ícone)
     */
    _construirConteudoMarcador(urlIcone, textoLabel, corTexto) {
        const container = document.createElement('div');
        container.className = 'custom-marker';

        // 1. O Label (Texto)
        const label = document.createElement('div');
        label.className = 'marker-label';
        label.textContent = textoLabel;
        label.style.color = corTexto;

        // 2. O Ícone (Imagem)
        const img = document.createElement('img');
        img.src = urlIcone;
        img.className = 'marker-icon';

        container.appendChild(label);
        container.appendChild(img);

        return container;
    }

    atualizarMeuMarcador(lat, lon) {
        if (!this.map || !this.AdvancedMarkerElement) return;
        const pos = { lat, lng: lon };

        if (!this.myMarker) {
            this.map.setCenter(pos);
            
            // Cria o elemento HTML do meu marcador
            const conteudo = this._construirConteudoMarcador(
                "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Azul
                "Você",
                "#2980b9" // Azul escuro
            );

            this.myMarker = new this.AdvancedMarkerElement({
                map: this.map,
                position: pos,
                content: conteudo,
                title: "Sua localização",
                zIndex: 999
            });
        } else {
            this.myMarker.position = pos;
        }
    }

    atualizarMarcadorTerceiro(data) {
        if (!this.map || !this.AdvancedMarkerElement) return;

        // Filtro de si mesmo
        if (String(data.id) === String(this.config.USER_ID) && this.config.USER_TYPE === 'VENDEDOR') return;

        // Normalização de dados
        const lat = data.lat || (data.geometry && data.geometry.coordinates[1]);
        const lon = data.lon || (data.geometry && data.geometry.coordinates[0]);
        
        const props = data.properties || data;
        const id = data.id;
        const nome = props.nome_fantasia || props.nome || "Vendedor";
        const estaOnline = (props.esta_online !== undefined) ? props.esta_online : true;

        if (!lat || !lon) return;

        // Remoção se offline
        if (estaOnline === false) {
            this.removerMarcador(id);
            return;
        }

        const pos = { lat, lng: lon };

        if (this.markers[id]) {
            // --- ATUALIZAÇÃO ---
            this.markers[id].position = pos;
            
            // Se o nome mudou, atualizamos o texto do DOM existente
            const labelDiv = this.markers[id].content.querySelector('.marker-label');
            if (labelDiv && labelDiv.textContent !== nome) {
                labelDiv.textContent = nome;
            }

        } else {
            // --- CRIAÇÃO ---
            const conteudo = this._construirConteudoMarcador(
                "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Vermelho
                nome,
                "#c0392b" // Vermelho escuro
            );

            this.markers[id] = new this.AdvancedMarkerElement({
                map: this.map,
                position: pos,
                content: conteudo,
                title: nome
            });
        }
    }

    removerMarcador(id) {
        if (this.markers[id]) {
            this.markers[id].map = null; // Remove do mapa
            delete this.markers[id];
        }
    }

    limparFantasmas(listaServidor) {
        if (!listaServidor) return;
        const idsValidos = new Set(listaServidor.map(item => String(item.id)));

        for (const idLocal in this.markers) {
            if (!idsValidos.has(String(idLocal))) {
                console.log(`🧹 Removendo fantasma: ID ${idLocal}`);
                this.removerMarcador(idLocal);
            }
        }
    }
}