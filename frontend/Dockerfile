# Imagem leve do Node
FROM node:22-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (cache layer)
COPY package.json package-lock.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Comando para rodar em modo desenvolvimento (com hot-reload)
CMD ["npm", "run", "dev", "--", "--host"]