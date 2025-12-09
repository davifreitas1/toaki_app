// src/componentes/organismos/MapaTempoReal.jsx
import React, { useEffect, useRef } from 'react';
import { useGoogleMapsApi } from '../../hooks/useGoogleMapsApi';
import { GerenciadorMapa } from '../../servicos/gerenciadorMapa';
import { SocketMapaClient } from '../../servicos/socketMapaClient';

/**
 * Props:
 * - userId
 * - userType
 * - wsUrl
 * - className
 * - raioKm (opcional, default 1)
 * - onVendedorClick (opcional) → recebe dados do vendedor + coords do cliente
 * - vendedorRastreadoId (opcional) → id do perfil_vendedor a rastrear
 * - onDistanciaRastreamentoChange (opcional) → recebe km (number) ou null
 */
const MapaTempoReal = ({
  userId,
  userType,
  wsUrl,
  className = '',
  raioKm = 1,
  onVendedorClick,
  vendedorRastreadoId,
  onDistanciaRastreamentoChange,
}) => {
  const mapsCarregados = useGoogleMapsApi();

  const mapDivRef = useRef(null);
  const mapaRef = useRef(null);
  const socketRef = useRef(null);
  const syncIntervalRef = useRef(null);
  const watchIdRef = useRef(null);
  const lastCoordsRef = useRef({ lat: null, lon: null });

  useEffect(() => {
    if (!mapsCarregados || !mapDivRef.current || !wsUrl) return;

    let desmontado = false;

    const mapa = new GerenciadorMapa({
      element: mapDivRef.current,
      userId,
      userType,
      onVendedorClick: (vendedorBasico) => {
        if (typeof onVendedorClick === 'function') {
          const { lat, lon } = lastCoordsRef.current || {};
          onVendedorClick({
            ...vendedorBasico,
            clienteCoords: { lat, lon },
          });
        }
      },
      onTrackingDistanceChange: onDistanciaRastreamentoChange || (() => {}),
    });
    mapaRef.current = mapa;

    const processarMensagemSocket = (data) => {
      const action = data.action;
      const payload = data.payload;

      if (action === 'vendedorAtualizado') {
        mapaRef.current?.atualizarMarcadorTerceiro(payload);
      } else if (action === 'buscarVendedores') {
        if (payload.vendedores && payload.vendedores.features) {
          const lista = payload.vendedores.features;
          lista.forEach((v) =>
            mapaRef.current?.atualizarMarcadorTerceiro(v)
          );
          mapaRef.current?.limparFantasmas(lista);
        }
      }
    };

    const iniciarRastreamentoGPS = () => {
      if (!navigator.geolocation) {
        console.log('Geolocalização não suportada neste dispositivo.');
        return;
      }

      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
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

    const iniciarBuscaVendedores = () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }

      syncIntervalRef.current = setInterval(() => {
        const { lat, lon } = lastCoordsRef.current;
        if (lat && lon) {
          socketRef.current?.enviar('buscarVendedores', {
            lat,
            lon,
            raioKm,
          });
        }
      }, 5000);
    };

    const aoConectarSocket = () => {
      if (desmontado) return;
      console.log('Online!');
      iniciarRastreamentoGPS();
      iniciarBuscaVendedores();
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

      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }

      if (
        watchIdRef.current !== null &&
        navigator.geolocation &&
        typeof navigator.geolocation.clearWatch === 'function'
      ) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }

      socketRef.current?.desconectar();
    };
  }, [mapsCarregados, wsUrl, userId, userType, raioKm, onDistanciaRastreamentoChange]);

  // Efeito só para ligar/desligar o rastreio, sem recriar o mapa
  useEffect(() => {
    if (!mapaRef.current) return;
    mapaRef.current.setRastreamento(vendedorRastreadoId || null);
  }, [vendedorRastreadoId]);

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

export default MapaTempoReal;
