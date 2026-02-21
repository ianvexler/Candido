# Ian's Workbench

Hi! This is my personal workbench: a place where I'll be building and experimenting with tools to help me manage my own work and tasks.

A full-stack app with a Next.js client and an Express API server, run via Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

## Running the stack

From the project root:

```bash
./run stack
```

This builds and starts the full stack in **development mode** with hot reload:

| Service | URL |
|---------|-----|-------------|
| **Client** (Next.js) | [http://localhost:3000](http://localhost:3000) |
| **Server** (Express API) | [http://localhost:8000](http://localhost:8000) |
| **Database** (PostgreSQL) | localhost:5432 |
| **Prisma Studio** | [http://localhost:5555](http://localhost:5555) |

Stop the stack with `Ctrl+C`.

## Other commands

```bash
./run client <command>           # Run a command in the client container (e.g. ./run client npm run build)
./run server <command>           # Run a command in the server container (e.g. ./run server npm start)
./run server:prisma <command>    # Run Prisma CLI (e.g. ./run server:prisma migrate dev)
./run server:prisma:studio       # Start Prisma Studio at http://localhost:5555
```
