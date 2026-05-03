#Manga Project Monorepo

Full-stack manga application with a React client and a TypeScript backend.

## Prerequisites

Install these before running the project locally:

- Node.js 24.x
- pnpm 10.x
- Docker Desktop, or Docker Engine with Docker Compose
- Git

If you use `nvm`, install and activate Node first:

```bash
nvm install 24
nvm use 24
```

Enable pnpm with Corepack, or install pnpm globally:

```bash
corepack enable
corepack prepare pnpm@10.30.3 --activate
```

Check your versions:

```bash
node --version
pnpm --version
docker --version
docker compose version
```

## Repository Layout

```text
client/  React frontend
server/  TypeScript backend
```

## Backend Setup

Install backend dependencies:

```bash
cd server
pnpm install
```

Create a local environment file:

```bash
cp .env.example .env.docker
```

### To set up client server completely
- Make sure to create .env file

Review `.env` and make sure values match your local Docker services.

Start the backend dependencies and backend app with Docker Compose:

```bash
pnpm dev:build-compose
```

Stop and remove the Docker Compose services:

```bash
pnpm dev:shutdown
```

Run the backend directly in development mode:

```bash
pnpm dev
```

Build the backend:

```bash
pnpm build
```

Run backend tests:

```bash
pnpm test
pnpm test:coverage
```

## Client Setup

Install frontend dependencies:

```bash
cd client
pnpm install
```

Run the frontend development server:

```bash
pnpm dev
```

Build the frontend:

```bash
pnpm build
```

## How to launch the full app

From one terminal, start the backend stack:

```bash
cd server
pnpm dev:build-compose
```

From another terminal, start the frontend:

```bash
cd client
pnpm dev
```

Use `server/.env.example` as the source of truth for required backend environment variables.
