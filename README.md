# Filmes-api
     # Catálogo de Filmes - Frontend

## Tecnologias

- **Next.js 16.0.5** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Bootstrap 5** - Framework CSS   


### Instalação

```bash
cd catalogo-filmes
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

- **Access Token**: Armazenado em `localStorage` com chave `access_token`
- **Refresh Token**: Armazenado em `localStorage` com chave `refresh_token`
- **Renovação automática**: Tokens expirados são renovados automaticamente

# Filmes-api


## Integração Frontend-Backend

O frontend utiliza **Fetch API** nativa do JavaScript para comunicação com o backend Django REST Framework.

### Características da Integração

- **Cliente HTTP**: Implementado em `catalogo-filmes/lib/api.ts`
- **Autenticação**: JWT (JSON Web Tokens) com renovação automática
- **Headers**: Configuração automática de `Authorization` e `Content-Type`
- **Tratamento de erros**: Captura e tratamento consistente de erros HTTP
- **Suporte a FormData**: Para upload de arquivos (posters de filmes)

