// src/servicos/gerenciadorMapa.js
/* global google */

import marcadorUsuario from '../ativos/marcador-usuario.png';
import marcadorVendedor from '../ativos/marcador-vendedor.png';

export class GerenciadorMapa {
  constructor({ element, userId, userType, onVendedorClick, onTrackingDistanceChange }) {
    this.element = element;
    this.map = null;
    this.markers = {}; // { id: AdvancedMarkerElement }
    this.myMarker = null;

    this.userId = userId;
    this.userType = userType;

    this.AdvancedMarkerElement = null;
    this.PinElement = null;
    this.Polyline = null;
    this.geometrySpherical = null;

    this.onVendedorClick = onVendedorClick || null;
    this.onTrackingDistanceChange = onTrackingDistanceChange || null;

    this.trackingVendorId = null;
    this.trackingPolyline = null;

    this.mapId =
      import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
  }

  async init() {
    if (!this.element) {
      console.error('Elemento do mapa não encontrado.');
      return;
    }

    const { Map, Polyline } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement, PinElement } =
      await google.maps.importLibrary('marker');
    const { spherical } = await google.maps.importLibrary('geometry');

    this.AdvancedMarkerElement = AdvancedMarkerElement;
    this.PinElement = PinElement;
    this.Polyline = Polyline;
    this.geometrySpherical = spherical;

    this.map = new Map(this.element, {
      center: { lat: -23.5505, lng: -46.6333 },
      zoom: 16,
      mapId: this.mapId,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      scaleControl: false,
    });
  }

  _construirConteudoMarcador(
    urlIcone,
    textoLabel,
    corTexto,
    onClick
  ) {
    const container = document.createElement(onClick ? 'button' : 'div');
    container.className = 'toaki-marker';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.gap = '4px';
    container.style.border = 'none';
    container.style.background = 'transparent';
    container.style.padding = '0';
    container.style.transform = 'translateY(-4px)';

    if (onClick) {
      container.type = 'button';
      container.style.cursor = 'pointer';
      container.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      });
    }

    // Label "Vendedor 2" / "Você"
    const label = document.createElement('div');
    label.className = 'toaki-marker-label';
    label.textContent = textoLabel;
    label.style.color = corTexto;
    label.style.backgroundColor = 'rgba(255,255,255,0.98)';
    label.style.padding = '3px 10px';
    label.style.borderRadius = '9999px';
    label.style.fontSize = '12px';
    label.style.fontWeight = '600';
    label.style.whiteSpace = 'nowrap';
    // leve borda + sombra pra destacar sobre o mapa
    label.style.border = '1px solid rgba(0,0,0,0.06)';
    label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.18)';

    // Ícone do marcador (pin)
    const img = document.createElement('img');
    img.src = urlIcone;
    img.className = 'toaki-marker-icon';
    img.style.width = '30px'; // 🔎 maior que antes (era ~24px)
    img.style.height = 'auto';
    img.style.display = 'block';
    // sombra forte só no pin pra dar relevo sem bolha
    img.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.45))';

    container.appendChild(label);
    container.appendChild(img);

    return container;
  }

  atualizarMeuMarcador(lat, lon) {
    if (!this.map || !this.AdvancedMarkerElement) return;
    const pos = { lat, lng: lon };

    if (!this.myMarker) {
      this.map.setCenter(pos);
      this.map.setZoom(16);

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

    this._atualizarLinhaRastreamento();
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

    if (
      this.trackingVendorId &&
      String(this.trackingVendorId) === String(id)
    ) {
      this._atualizarLinhaRastreamento();
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

  /**
   * Ativa/desativa rastreamento de um vendedor específico
   */
  setRastreamento(vendorId) {
    this.trackingVendorId = vendorId || null;

    if (!this.trackingVendorId) {
      if (this.trackingPolyline) {
        this.trackingPolyline.setMap(null);
        this.trackingPolyline = null;
      }
      if (this.onTrackingDistanceChange) {
        this.onTrackingDistanceChange(null);
      }
      return;
    }

    this._atualizarLinhaRastreamento();
  }

  /**
   * Atualiza a linha reta entre o cliente e o vendedor sendo rastreado
   * e calcula a distância em km.
   */
  _atualizarLinhaRastreamento() {
    if (!this.map || !this.trackingVendorId || !this.myMarker) return;

    const vendedorMarker = this.markers[this.trackingVendorId];
    if (!vendedorMarker) return;

    const userPos = this.myMarker.position;
    const vendorPos = vendedorMarker.position;

    if (!userPos || !vendorPos) return;

    const path = [userPos, vendorPos];

    if (!this.trackingPolyline) {
      if (!this.Polyline) return;

      this.trackingPolyline = new this.Polyline({
        map: this.map,
        path,
        strokeColor: '#0FB5B5',
        strokeOpacity: 0.9,
        strokeWeight: 3,
      });
    } else {
      this.trackingPolyline.setPath(path);
    }

    if (this.geometrySpherical && this.onTrackingDistanceChange) {
      try {
        const p1 = new google.maps.LatLng(userPos);
        const p2 = new google.maps.LatLng(vendorPos);
        const metros = this.geometrySpherical.computeDistanceBetween(p1, p2);
        const km = metros / 1000;
        this.onTrackingDistanceChange(Number(km.toFixed(3)));
      } catch (e) {
        console.error('Erro ao calcular distância de rastreio', e);
      }
    }
  }
}
