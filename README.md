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
  "action": "nomeDaAcaoEmCamelCase",  // Obrigatório: Define o que fazer
  "payload": {                        // Opcional: Dados da ação
    "campo1": "valor",
    "lat": -23.5
  },
  "requestId": "uuid-v4"              // Opcional: Para rastrear a resposta (Ack)
}
