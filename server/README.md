# Burguer Joint Menu - Backend ⚙️

A API Rest consiste na implementação operações de **CRUD** (Create, Read, Update and Delete) para manipulação de **usuários** (clientes e administradores), **produtos** (que seriam a parte do cardápio do restaurante) e **pedidos** (os pedidos feitos pelos usuários).

Para manter a eficácia da aplicação, ela foi construida aplicando os princípios de inversão de dependência da **Clean Architecture**, otimizando a implementação dos **testes automatizados**.

A autenticação da aplicação é feita através de **JWT Tokens**.

## Techs 💻

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)![Drizzle](https://img.shields.io/badge/Drizzle-%23000000?style=for-the-badge&logo=drizzle&logoColor=C5F74F)![Vitest](https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B)![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

## Rotas ↗️

### users

- **GET /profile**
- **GET /orders/:page**
- **POST /register**
- **POST /login**
- **PATCH /add-address-and-name**
- **PUT /update-profile**

### products

- **PATCH /active/:id**
- **POST /create**
- **POST /upload/:id**
- **DELETE /:id**
- **PATCH /disable/:id**
- **GET /list**
- **GET /:id**
- **PUT /update/:id**

### orders

- **PATCH /active/:id**
- **POST /create**
- **GET /**
- **GET /user/:userId/:page**
