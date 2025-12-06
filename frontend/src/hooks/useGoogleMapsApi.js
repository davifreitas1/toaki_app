// src/hooks/useGoogleMapsApi.js
import { useEffect, useState } from 'react';

let googleMapsPromise = null;

export function useGoogleMapsApi() {
  const [carregado, setCarregado] = useState(
    typeof window !== 'undefined' && !!window.google && !!window.google.maps
  );

  useEffect(() => {
    if (carregado) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('VITE_GOOGLE_MAPS_API_KEY não configurada.');
      return;
    }

    if (!googleMapsPromise) {
      googleMapsPromise = new Promise((resolve, reject) => {
        const callbackName = 'initGoogleMapsToAki';

        window[callbackName] = () => {
          resolve();
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&loading=async`;
        script.async = true;
        script.defer = true;
        script.onerror = (err) => {
          console.error('Erro ao carregar Google Maps:', err);
          reject(err);
        };

        document.head.appendChild(script);
      });
    }

    googleMapsPromise
      .then(() => {
        setCarregado(true);
      })
      .catch(() => {
        setCarregado(false);
      });
  }, [carregado]);

  return carregado;
}
