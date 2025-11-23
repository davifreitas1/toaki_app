# ToAki - Documentação v0

Este projeto utiliza **Django (Channels e GeoDjango)**, **Redis** e **PostGIS** para orquestrar a comunicação em tempo real entre Vendedores e Clientes na praia.

---

## Arquitetura e Padrão de Design

O projeto tentar utilizar POO na maioria dos contextos, seguir um padrão de estrutura de pastas lógico, o máximo de variáveis em PT-BR e divisão de responsabilidade única para cada arquivo.

### Estrutura de Diretórios do App (`toaki_app/`)

| Diretório / Arquivo | Responsabilidade (O que faz?) |
| :--- | :--- |
| **`models/`** | **Camada de Dados (Entidades do Banco de Dados).|
| ├── `usuario.py` | Autenticação (AbstractUser) e controle de acesso (Cliente/Vendedor). |
| ├── `perfil_vendedor.py` | Dados da Entidade Vendedor (Status, GeoPoint). |
| └── `perfil_cliente.py` | Dados da Entidade Cliente (GeoPoint). |
| **`websocket/`** | **Camada do WebSocket para comunicação em tempo real** Gerencia a conexão Socket. |
| ├── `consumer.py` | **Consumer** Gerencia conexão, futuramente gerenciará Autenticação e Entrada e saída de dados. |
| ├── `roteador.py` | **Roteador** Lê a `action` do JSON e delega. |
| └── `processadores/` | **Regra de Negócio / Consulta ao Banco** Regras de negócio puras. |
| &nbsp;&nbsp;&nbsp;&nbsp;└── `localizacao.py` | Lógica de Geohash, cálculo de vendedores próximos e persistência. |
| **`signals/`** | **Camada de Reatividade.** |
| ├── `vendedor.py` | Escuta o Banco de Dados (PostSave) e dispara mensagens JSON ao Socket. |
| └── `__init__.py` | Registra os signals na inicialização do App. |
| **`serializers/`** | **Transformação de Dados.** Converte Models em GeoJSON. |
| ├── `perfil_vendedor.py` ** |

---

## Protocolo WebSocket (WSS)

A comunicação é bidirecional e segue um padrão estrito de **Envelope JSON** para simular uma arquitetura RESTful sobre WebSockets.

- **Endpoint:** `ws://<host>:8000/ws/mapa/`

###  Envelope de Requisição (Client -> Server)

Todo envio do Frontend para o Backend deve respeitar este contrato:

```json
{
  "action": "nomeDaAcaoEmCamelCase",
  "payload":{ ... },
}
```
### Envelope de Resposta (Server -> Client)

```json
{
  "status": "success" ou "error",
  "action": "nomeDaAcaoOriginal",
  "payload": { ... },
}
```

---

## Catálogo de Ações

### 1. Atualizar Localização (Input)
Envia a posição GPS atual. O backend salva no PostGIS, calcula o **Geohash** e inscreve o usuário na sala correspondente.

- **Action:** `atualizarLocalizacao`

**Payload (Request):**
```json
{
  "lat": -23.550520,
  "lon": -46.633308
}
```

**Retorno (Success):**
```json
{
  "mensagem": "Localização processada com sucesso",
  "area_codigo": "6gyf4c" // Geohash central
}
```

---

### 2. Buscar Vendedores (Input)
Solicita lista de vendedores ativos num raio de KM. Usado para popular o mapa inicialmente e também para atualizar a lista de Vendedores próximos.

- **Action:** `buscarVendedores`

**Payload (Request):**
```json
{
  "lat": -23.550520,
  "lon": -46.633308,
  "raioKm": 5 // Opcional (Default: 1)
}
```

**Retorno (Success):**
Retorna um **GeoJSON FeatureCollection**.

```json
{
  "vendedores": {
    "type": "FeatureCollection",
    "features": [
      {
        "id": 1,
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-46.6333, -23.5505] // [Lat, Lon]
        },
        "properties": {
          "nome_fantasia": "Barraca do João",
          "esta_online": true
        }
      }
    ]
  }
}
```

---

### 3. Eventos de Push (Server -> Client)
Disparados espontaneamente via **Signals** quando o estado do banco muda.

#### Evento: `vendedorAtualizado`
Ocorre quando um vendedor se move ou muda status. Enviado para todos na mesma área/geohash.

**Payload Recebido:**
```json
{
  "id": 1,
  "nome_fantasia": "Barraca do João",
  "esta_online": true,
  "lat": -23.550520,
  "lon": -46.633308
}
```

---

## Guia de Integração Frontend

Para garantir fluidez e consistência, o Frontend deve implementar a **Estratégia Híbrida (Push + Pull)**:

1.  **Conexão:** Conectar em `/ws/mapa/` com reconexão automática.
2.  **Push (Tempo Real):**
    - Enviar `atualizarLocalizacao` a cada `watchPosition`.
    - Escutar `vendedorAtualizado` para mover/criar marcadores.
3.  **Pull (Sincronização):**
    - A cada 5-10s, enviar `buscarVendedores`.
    - **Importante:** Comparar a resposta com os marcadores locais e **remover** aqueles que não estão na lista nova.

---

## 🛠️ Setup (Docker)

Depois de instalar devidamente o Docker, basta entrar na pasta pelo terminal de rodar o comando "docker compose up -d" para fazer o servidor Django rodar.
