# Projeto: Aplicação web com persistência de dados do lado do servidor

![Screenshot do projeto](src/assets/gif.gif "Screenshot do projeto")

Acesso: [https://project3-2025a-bruno-frontend.onrender.com](https://project3-2025a-bruno-frontend.onrender.com)  
Backend: [https://project3-2025a-bruno-backend.onrender.com](https://project3-2025a-bruno-backend.onrender.com)

### Desenvolvedores

- Bruno Perussatto — Ciência da Computação

---

### Nosso produto

Foi desenvolvida uma aplicação web de **compartilhamento de links noticiosos**, com funcionalidades completas de:

- Login de usuários com sessões persistentes via cookies
- Envio de links com título e URL, associados ao usuário logado
- Listagem geral de todos os links enviados por todos os usuários
- Página exclusiva para os links do usuário logado ("Meus links")
- Funcionalidade de **favoritar** links e listagem de favoritos por usuário
- Filtro dinâmico por título, autor ou data
- Possibilidade de **reportar** links com motivos (fake news, conteúdo impróprio, etc.)
- Paginação com "Ver mais" (inicialmente mostra 6 links e permite expandir)
- Visual organizado com grid de cards e navegação clara

A aplicação está alinhada com a temática "Compartilhamento", permitindo aos usuários contribuírem e organizarem links de notícias relevantes em uma plataforma comum.

---

### Desenvolvimento

O desenvolvimento foi dividido em:

1. **Planejamento de funcionalidades** — com base nos requisitos da disciplina.
2. **Configuração do backend** com Flask + SQLAlchemy + MySQL.
3. **Criação de modelos de dados** e APIs REST para links e favoritos.
4. **Frontend em React com Tailwind CSS** usando Vite para build e hot-reload.
5. **Integração entre frontend e backend** com sessões, cookies e autenticação.
6. **Deploy completo** no Render com backend Python e frontend React servidos separadamente.
7. **Refinamento de layout**, responsividade e adição de interatividade (favoritos, filtros, modais).

---

#### Tecnologias

- Python 3.11
- Flask
- Flask-CORS
- Flask-Session
- Flask-SQLAlchemy
- MySQL + Railway (cloud database)
- React 18
- Vite
- Axios
- Tailwind CSS
- Render (deploy)
- Gunicorn

---

#### Ambiente de desenvolvimento

- VS Code com extensões:
  - Python
  - ESLint
  - Tailwind CSS IntelliSense
- MySQL Workbench
- Postman para testes de API
- GitHub para versionamento e deploy via Render

---

#### Referências e créditos

- [Documentação oficial do Flask](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Render – Deploy Flask + React](https://render.com/docs/deploy-flask)
- [Railway – Banco de dados MySQL online](https://railway.app/)
- Ícones usados do Unicode (★ e 🛑)
- Agradecimentos ao suporte do ChatGPT com:
  - Configuração de CORS e cookies cross-origin
  - Correção de deploy com `SESSION_COOKIE_SAMESITE=None` e `SESSION_COOKIE_SECURE=True`
  - Organização de layout em Tailwind
  - Lógica de favoritos e paginação incremental

---

Projeto entregue para a disciplina de [Desenvolvimento de Software para a Web](http://github.com/andreainfufsm/elc1090-2025a) em 2025a.
