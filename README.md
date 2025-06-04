# HDC - Hora de Cuidar

Este repositório contém o sistema de apoio nutricional **Hora de Cuidar**, uma plataforma digital voltada para o autocuidado e o acompanhamento remoto de pessoas com doenças crônicas não transmissíveis (DCNTs), promovendo a autonomia do paciente e a integração com profissionais da saúde.

## 🎯 Objetivo

Entregar um MVP funcional até **agosto de 2025**, com foco em **simplicidade, estabilidade e escalabilidade**, viabilizando o registro de refeições, planos alimentares, notificações e acompanhamento nutricional.

## 🚀 Tecnologias

- **Monorepo:** Turborepo
- **Backend:** NestJS, Prisma, PostgreSQL
- **Frontend:** React com TypeScript
- **Banco de Dados:** PostgreSQL
- **Infraestrutura:** Docker, Railway, Vercel
- **Gerenciamento de variáveis:** Infisical

## ⚙️ Pré-requisitos

- Node.js >= 22.15.0
- npm >= 11.0.0
- Docker e Docker Compose
- [Infisical CLI](https://infisical.com/docs/cli/overview)

## 📦 Instalação

### 1. Clone o repositório

```
git clone <url-do-repositorio>
cd hdc
````

### 2. Instale as dependências

```
npm install
```

### 3. Configure o Infisical

```
infisical login
```

> É necessário estar adicionado na organização do projeto para sincronizar as variáveis.

## 🧪 Desenvolvimento

### Suba os serviços com Docker

```
npm run docker-compose up -d
```

* PostgreSQL e Adminer serão inicializados.
* Adminer disponível em: [http://localhost:8080](http://localhost:8080)

### Gere o client do Prisma

```
npm run db:build
```

### Execute as migrações

```
npm run db:migrate:dev
```

### Rode a aplicação

```
npm run dev
```

## 🔨 Criando novos módulos (NestJS)

```
cd apps/api
npx nest g resource nome-do-modulo
```

> Isso criará o módulo em `src/modules/nome-do-modulo/`.

## 📂 Estrutura

```
apps/
  api/        # Backend (NestJS)
  web/        # Frontend (React)
packages/     # Pacotes reutilizáveis (ex: tipos, utilitários)
```

## 📋 Padrão de Commits

Adotamos o padrão [iuricode/padroes-de-commits](https://github.com/iuricode/padroes-de-commits):

* `✨ feat:` nova funcionalidade
* `🐛 fix:` correção de bug
* `📚 docs:` documentação
* `♻️ refactor:` refatoração
* `🔧 chore:` ajustes de build/infra

## 🔒 Segurança

* Armazenamento de senhas com bcrypt
* Controle de acesso por `roles` (Paciente, Nutricionista, Admin)
* Conformidade com a LGPD

---

> Dúvidas ou sugestões? Entre em contato com a equipe técnica ou orientadores do projeto.
