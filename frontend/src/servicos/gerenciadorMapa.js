// src/servicos/gerenciadorMapa.js
/* global google */

import marcadorUsuario from '../ativos/marcador-usuario.png';
import marcadorVendedor from '../ativos/marcador-vendedor.png';

export class GerenciadorMapa {
  constructor({ element, userId, userType, onVendedorClick }) {
    this.element = element;
    this.map = null;
    this.markers = {}; // { id: AdvancedMarkerElement }
    this.myMarker = null;

    this.userId = userId;
    this.userType = userType;

    this.AdvancedMarkerElement = null;
    this.PinElement = null;

    this.onVendedorClick = onVendedorClick || null;

    this.mapId =
      import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
  }

  async init() {
    if (!this.element) {
      console.error('Elemento do mapa não encontrado.');
      return;
    }

    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement, PinElement } =
      await google.maps.importLibrary('marker');

    this.AdvancedMarkerElement = AdvancedMarkerElement;
    this.PinElement = PinElement;

    this.map = new Map(this.element, {
      center: { lat: -23.5505, lng: -46.6333 },
      zoom: 14,
      mapId: this.mapId,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      scaleControl: false,
    });
  }

  _construirConteudoMarcador(urlIcone, textoLabel, corTexto, onClick) {
    const container = document.createElement(onClick ? 'button' : 'div');
    container.className = 'toaki-marker';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.gap = '4px';

    if (onClick) {
      container.type = 'button';
      container.style.cursor = 'pointer';
      container.style.background = 'transparent';
      container.style.border = 'none';
      container.addEventListener('click', (event) => {
        event.stopPropagation();
        onClick();
      });
    }

    const label = document.createElement('div');
    label.className = 'toaki-marker-label';
    label.textContent = textoLabel;
    label.style.color = corTexto;
    label.style.backgroundColor = 'rgba(255,255,255,0.96)';
    label.style.padding = '4px 10px';
    label.style.borderRadius = '9999px';
    label.style.fontSize = '12px';
    label.style.fontWeight = '600';
    label.style.whiteSpace = 'nowrap';
    label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.18)';

    const img = document.createElement('img');
    img.src = urlIcone;
    img.className = 'toaki-marker-icon';
    img.style.width = '24px';
    img.style.height = 'auto';
    img.style.display = 'block';

    container.appendChild(label);
    container.appendChild(img);

    return container;
  }

  atualizarMeuMarcador(lat, lon) {
    if (!this.map || !this.AdvancedMarkerElement) return;
    const pos = { lat, lng: lon };

    if (!this.myMarker) {
      this.map.setCenter(pos);
      this.map.setZoom(14);

      const conteudo = this._construirConteudoMarcador(
        marcadorUsuario,
        'Você',
        'var(--cor-marca-secundaria)'
      );

      this.myMarker = new this.AdvancedMarkerElement({
        map: this.map,
        position: pos,
        content: conteudo,
        title: 'Sua localização',
        zIndex: 999,
      });
    } else {
      this.myMarker.position = pos;
    }
  }

  atualizarMarcadorTerceiro(data) {
    if (!this.map || !this.AdvancedMarkerElement) return;

    if (
      String(data.id) === String(this.userId) &&
      this.userType === 'VENDEDOR'
    ) {
      return;
    }

    const lat = data.lat || (data.geometry && data.geometry.coordinates[1]);
    const lon = data.lon || (data.geometry && data.geometry.coordinates[0]);

    const props = data.properties || data;
    const id = data.id;
    const nome = props.nome_fantasia || props.nome || 'Vendedor';
    const estaOnline =
      props.esta_online !== undefined ? props.esta_online : true;

    if (!lat || !lon) return;

    if (estaOnline === false) {
      this.removerMarcador(id);
      return;
    }

    const pos = { lat, lng: lon };

    if (this.markers[id]) {
      this.markers[id].position = pos;

      const labelDiv =
        this.markers[id].content.querySelector('.toaki-marker-label');
      if (labelDiv && labelDiv.textContent !== nome) {
        labelDiv.textContent = nome;
      }
    } else {
      const handleClick = () => {
        if (this.onVendedorClick) {
          this.onVendedorClick({
            id,
            nome,
            latitude: lat,
            longitude: lon,
          });
        }
      };

      const conteudo = this._construirConteudoMarcador(
        marcadorVendedor,
        nome,
        '#E86F3E',
        handleClick
      );

      this.markers[id] = new this.AdvancedMarkerElement({
        map: this.map,
        position: pos,
        content: conteudo,
        title: nome,
      });
    }
  }

  removerMarcador(id) {
    if (this.markers[id]) {
      this.markers[id].map = null;
      delete this.markers[id];
    }
  }

  limparFantasmas(listaServidor) {
    if (!listaServidor) return;
    const idsValidos = new Set(
      listaServidor.map((item) => String(item.id))
    );

    for (const idLocal in this.markers) {
      if (!idsValidos.has(String(idLocal))) {
        this.removerMarcador(idLocal);
      }
    }
  }
}
