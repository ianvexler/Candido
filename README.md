# Ian's Workbench

A full-stack app with a Next.js client and an Express API server, run via Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

## Running the stack

From the project root:

```bash
./run stack
```

This builds and starts both services in **development mode** with hot reload:

- **Client** (Next.js): [http://localhost:3000](http://localhost:3000) — changes to the client are reflected on refresh
- **Server** (Express API): [http://localhost:8000](http://localhost:8000) — server restarts automatically on file changes

## Other commands

Run a one-off command in a service:

```bash
./run client <command>   # e.g. ./run client npm run build
./run server <command>  # e.g. ./run server npm start
```
