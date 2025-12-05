
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


## Tecnologias Utilizadas

### Backend
- Django 5.2.8
- Django REST Framework 3.16.1
- Django CORS Headers 4.9.0
- Simple JWT 5.5.1
- Pillow 12.0.0




