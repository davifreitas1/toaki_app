// src/componentes/organismos/MapaTempoRealVendedor.jsx
import React, { useEffect, useRef } from 'react';
import { useGoogleMapsApi } from '../../hooks/useGoogleMapsApi';
import { GerenciadorMapa } from '../../servicos/gerenciadorMapa';
import { SocketMapaClient } from '../../servicos/socketMapaClient';

/**
 * Componente de mapa para vendedores.
 * - Não exibe clientes
 * - Apenas sincroniza a própria localização com o backend via WebSocket
 */
const MapaTempoRealVendedor = ({ userId, userType, wsUrl, className = '' }) => {
  const mapsCarregados = useGoogleMapsApi();

  const mapDivRef = useRef(null);
  const mapaRef = useRef(null);
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);
  const lastCoordsRef = useRef({ lat: null, lon: null });

  useEffect(() => {
    if (!mapsCarregados || !mapDivRef.current || !wsUrl) return;

    let desmontado = false;

    const mapa = new GerenciadorMapa({
      element: mapDivRef.current,
      userId,
      userType,
    });
    mapaRef.current = mapa;

    const processarMensagemSocket = () => {};

    const iniciarRastreamentoGPS = () => {
      if (!navigator.geolocation) {
        console.log('Geolocalização não suportada neste dispositivo.');
        return;
      }

      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000,
      };

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          lastCoordsRef.current = { lat, lon };
          mapaRef.current?.atualizarMeuMarcador(lat, lon);

          socketRef.current?.enviar('atualizarLocalizacao', {
            lat,
            lon,
          });
        },
        (err) => {
          console.error('Erro GPS:', err);
        },
        geoOptions
      );

      watchIdRef.current = watchId;
    };

    const aoConectarSocket = () => {
      if (desmontado) return;
      iniciarRastreamentoGPS();
    };

    const socket = new SocketMapaClient(
      wsUrl,
      processarMensagemSocket,
      aoConectarSocket
    );
    socketRef.current = socket;

    mapa.init().then(() => {
      if (!desmontado) {
        socket.conectar();
      }
    });

    return () => {
      desmontado = true;

      if (
        watchIdRef.current !== null &&
        navigator.geolocation &&
        typeof navigator.geolocation.clearWatch === 'function'
      ) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }

      socketRef.current?.desconectar();
    };
  }, [mapsCarregados, wsUrl, userId, userType]);

  return (
    <div className={`flex flex-col w-full h-full ${className}`}>
      <div
        ref={mapDivRef}
        className="
          w-full
          h-full
          min-h-[240px]
          rounded-[24px]
          overflow-hidden
          shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        "
      />
    </div>
  );
};

export default MapaTempoRealVendedor;