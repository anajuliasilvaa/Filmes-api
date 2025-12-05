# Filmes-api
Realização de uma atividade avaliativa de Web II
# Catalogo de Filmes

Este projeto esta dividido em duas branches:
- backend: API Django REST Framework
- frontend: Aplicacao Next.js

## Estrutura do Projeto

- Backend: Django REST Framework com SQLite
- Frontend: Next.js com TypeScript e bootStrap CSS

## Instrucoes de Execucao

### Backend (Django)

1. Navegue ate a pasta raiz do backend:
```bash
cd Filmes-api
```

2. Crie e ative o ambiente virtual:
```bash
python -m venv .venv
.venv\Scripts\activate
```

3. Instale as dependencias:
```bash
pip install -r requirements.txt
```

4. Execute as migracoes:
```bash
python manage.py migrate
```

5. Inicie o servidor:
```bash
python manage.py runserver
```

O backend estara disponivel em: http://localhost:8000

### Frontend (Next.js)

1. Navegue ate a pasta do frontend:
```bash
cd catalogo-filmes
```

2. Instale as dependencias:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estara disponivel em: http://localhost:3000

## Tecnologias Utilizadas

### Backend
- Django 5.2.8
- Django REST Framework 3.16.1
- Django CORS Headers 4.9.0
- Simple JWT 5.5.1
- Pillow 12.0.0

### Frontend
- Next.js 16.0.5
- React 19.2.0
- TypeScript 5
- Tailwind CSS 4
