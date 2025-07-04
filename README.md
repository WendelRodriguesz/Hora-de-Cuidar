# HDC - Hora de Cuidar

Este repositório contém o sistema de apoio nutricional **Hora de Cuidar**, uma plataforma digital voltada para o autocuidado e o acompanhamento remoto de pessoas com doenças crônicas não transmissíveis (DCNTs), promovendo a autonomia do paciente e a integração com profissionais da saúde.
Desenvolvida como um monorepo com tecnologias modernas e integração com o Infisical para gerenciamento de variáveis.

## 🎯 Objetivo

Entregar um MVP funcional até **dezembro de 2025**, com foco em **simplicidade, estabilidade e escalabilidade**, viabilizando o registro de refeições, planos alimentares, notificações e acompanhamento nutricional.

## 🚀 Tecnologias

- **Monorepo:** Turborepo
- **Frontend:** React com TypeScript + Vite
- **Backend:** NestJS + Prisma
- **Banco de Dados:** PostgreSQL
- **Infraestrutura:** Docker, Railway, Vercel
- **Segurança:** Infisical (env vars), bcrypt, roles
- **Outros:** Redis, Adminer

## 📦 Pré-requisitos

- Node.js >= 22
- npm >= 11
- Docker e Docker Compose
- [Infisical CLI](https://infisical.com/docs/cli/overview)

## ⚙️ Instalação

### 1. Clone o repositório

```
git clone https://github.com/WendelRodriguesz/Hora-de-Cuidar.git
cd hora-de-cuidar
````

### 2. Instale as dependências

```
npm install
```

### 3. Configure o Infisical

```
infisical login
```

### 4. Suba os containers

```
npm run docker-compose up -d
```

Acesse:

* Adminer: [http://localhost:8081](http://localhost:8081)
* API: [http://localhost:3000](http://localhost:3000)
* Web: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Desenvolvimento

### Inicie o projeto

```
npm run dev
```

### Prisma

```
npm run db:build
npm run db:migrate:dev
```

Prisma Studio:

```
cd apps/api
npx prisma studio
```

---

## 🛠 Criando módulos NestJS

```
cd apps/api
npx nest g resource nome-do-modulo
```

---

## 📁 Estrutura

```
apps/
  api/   # Backend (NestJS)
  web/   # Frontend (React + Vite)
packages/
  ...    # Bibliotecas compartilhadas (tipos, hooks)
```

---

## 📋 Padrão de commits

Adotamos o padrão do [iuricode/padroes-de-commits](https://github.com/iuricode/padroes-de-commits):

* `✨ feat:` nova funcionalidade
* `🐛 fix:` correção de bug
* `📚 docs:` mudanças em documentação
* `♻️ refactor:` melhoria no código
* `🔧 chore:` configurações, builds, etc.

---

## 🔒 Segurança

- Armazenamento de senhas com bcrypt
- Controle de acesso por `roles` (Paciente, Nutricionista, Admin)
- Conformidade com a LGPD

---

Dúvidas? Fale com a equipe técnica ou oriente-se com os tutores/orientadores do projeto.