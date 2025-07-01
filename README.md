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
git clone https://github.com/WendelRodriguesz/Hora-de-Cuidar.git
cd hora-de-cuidar
```

### 2. Instale as dependências

```
npm install
```

### 3. Suba os serviços com Docker

```
docker-compose up -d
```

- PostgreSQL estará disponível na porta `5433`
- Redis estará disponível na porta `6380`
- Adminer estará disponível em: [http://localhost:8081](http://localhost:8081)

### 4. Configure e logue no Infisical

```
infisical login
```

### 5. Adicione as variáveis no Infisical (ambiente Development)

| Nome           | Valor                                                                 |
|----------------|-----------------------------------------------------------------------|
| DATABASE_URL   | `postgresql://hdc_bd:hdcfiocruz@localhost:5433/hdc?schema=public`     |
| REDIS_HOST     | `localhost`                                                           |
| REDIS_PORT     | `6380`                                                                |
| PORT           | `3000`                                                                |

(Opcional para frontend)
| VITE_API_URL   | `http://localhost:3000`                                               |

---

### 6. Rode o projeto com:

```
infisical run --env=dev -- npm run dev
```

ou diretamente:

```
npm run dev
```

---

## 🧪 Desenvolvimento

- Acesse `http://localhost:3000` para testar a API
- Acesse `http://localhost:5173` para acessar o frontend
- Acesse `http://localhost:8081` para inspecionar o banco via Adminer

---

## 🔨 Criando novos módulos (NestJS)

```
cd apps/api
npx nest g resource nome-do-modulo
```

Os arquivos serão criados em `apps/api/src/modules`.

---

## 🔧 Migrações Prisma

Dentro de `apps/api`, rode:

```
npm run db:generate
npm run db:migrate
```

---

## 📂 Estrutura

```
apps/
  api/        # Backend (NestJS)
  web/        # Frontend (React + Vite)
packages/     # Pacotes reutilizáveis (tipos, hooks)
```

---

## 📋 Padrão de Commits

Adotamos o padrão do [iuricode/padroes-de-commits](https://github.com/iuricode/padroes-de-commits):

- `✨ feat:` nova funcionalidade
- `🐛 fix:` correção de bug
- `📚 docs:` documentação
- `♻️ refactor:` refatoração
- `🔧 chore:` ajustes de configuração/build

---

## 🔒 Segurança

- Armazenamento de senhas com bcrypt
- Controle de acesso por `roles` (Paciente, Nutricionista, Admin)
- Conformidade com a LGPD

---

Dúvidas? Fale com a equipe técnica ou oriente-se com os tutores/orientadores do projeto.