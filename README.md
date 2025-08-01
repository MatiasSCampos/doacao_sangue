# Sistema de Doação de Sangue

Este projeto contém um sistema completo de doação de sangue com backend Express+Prisma e frontend React.

## Estrutura do Projeto

- **backend/**: API REST com Express, Prisma, JWT e Swagger
- **frontend/**: Aplicação React com autenticação JWT e CRUD

## Características Implementadas

### Backend (Express + Prisma)
- ✅ 10 classes UML no schema Prisma
- ✅ Seed com dados para todos os modelos
- ✅ Repositories com CRUD para 2 modelos relacionados (Doacao e Pessoa)
- ✅ Controllers (2 controllers + 1 de autenticação JWT)
- ✅ Routes (2 routes + 1 de autenticação JWT)
- ✅ Schemas documentados no Swagger
- ✅ Middleware JWT para autenticação
- ✅ Documentação Swagger em /docs

### Frontend (React)
- ✅ Tela de login com autenticação JWT
- ✅ Dashboard com CRUD completo para doações
- ✅ Interface responsiva com Tailwind CSS
- ✅ Integração completa com backend
- ✅ Gerenciamento de estado com Context API

## Como Executar

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```
acessando o banco de dados
npx prisma studio

reset do banco de dados
npx prisma migrate reset


O backend estará disponível em: http://localhost:3000
Documentação Swagger: http://localhost:3000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em: http://localhost:5173

## Credenciais de Teste

**Email:** carlos@email.com  
**Senha:** senha123

## Tecnologias Utilizadas

### Backend
- Node.js + Express
- Prisma ORM
- SQLite (banco de dados)
- JWT (autenticação)
- Swagger (documentação)
- bcrypt (criptografia)

### Frontend
- React 18
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Context API

## Modelos do Banco de Dados

1. Pessoa
2. Funcionario
3. Doacao
4. Exame
5. TipoExame
6. Estoque
7. Transfusao
8. Paciente
9. Hospital
10. Agendamento

Todos os modelos possuem relacionamentos apropriados e dados de exemplo no seed.

#   p r o j e t o - d o a - o - s a n g u e  
 #   d o a c a o _ s a n g u e  
 #   d o a c a o _ s a n g u e  
 #   d o a c a o _ s a n g u e  
 