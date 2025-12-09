import { obterUrlHttp } from '../uteis/apiConfig';

const cacheVendedorDistancia = new Map();
const cachePerfilVendedor = new Map();

export const obterPerfilVendedor = async (vendedorId) => {
  if (cachePerfilVendedor.has(vendedorId)) {
    return cachePerfilVendedor.get(vendedorId);
  }

  const url = obterUrlHttp(`/api/perfis/vendedores/${vendedorId}`);

  const resp = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!resp.ok) {
    throw new Error('Não foi possível carregar o vendedor.');
  }

  const json = await resp.json();
  cachePerfilVendedor.set(vendedorId, json);
  return json;
};

export const obterVendedorComDistancia = async ({
  vendedorId,
  latitude,
  longitude,
  raioKm = 1,
}) => {
  const key = `${vendedorId}|${latitude ?? '-'}|${longitude ?? '-'}|${raioKm}`;

  if (cacheVendedorDistancia.has(key)) {
    return cacheVendedorDistancia.get(key);
  }

  const params = new URLSearchParams();
  params.set('ativos', 'true');

  if (latitude != null && longitude != null) {
    params.set('latitude', String(latitude));
    params.set('longitude', String(longitude));
    params.set('raio_km', String(raioKm));
  }

  const url = obterUrlHttp(
    `/api/perfis/localizacao/vendedores?${params.toString()}`
  );

  const resp = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!resp.ok) {
    throw new Error('Não foi possível listar vendedores.');
  }

  const lista = await resp.json();
  const encontrado = lista.find(
    (v) => String(v.id) === String(vendedorId)
  );

  // pode ser null se o vendedor estiver fora do raio; ainda assim cacheamos
  cacheVendedorDistancia.set(key, encontrado || null);

  return encontrado || null;
};
