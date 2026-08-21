<img src="candido.png" alt="Candido" width="200" />

<hr />

Candido is a job application tracker that helps you manage your job search. Add roles you're interested in, move them through stages as you progress, and keep everything organized in one place.

Try it live at [candidohq.com](https://candidohq.com)

### Board

Track your applications at a glance with a drag-and-drop board. Move roles through each stage—from applied to offer—as things progress.

<img src="client/lib/images/BoardScreenshot.png" alt="Board view" width="680" />

### Sheet

View all your applications in one table. Sort, filter, and search by company or status, and use tags to keep everything in order.

<img src="client/lib/images/SheetScreenshot.png" alt="Sheet view" width="680" />

### Manage applications

Add applications easily and upload the description, your CV and cover letter. All the details you need, in one place.

<img src="client/lib/images/EditJobScreenshot.png" alt="Edit job form" width="680" />

<hr />

A full-stack app with a Next.js client and a Rails API, run via Docker Compose. Rails talks to the existing Prisma Postgres schema.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

## Running the stack

From the project root:

```bash
./run stack
```

This builds and starts the stack in **development mode** with hot reload:

| Service | URL |
|---------|-----|
| **Client** (Next.js) | [http://localhost:3000](http://localhost:3000) |
| **API** (Rails) | [http://localhost:8000](http://localhost:8000) |
| **Database** (PostgreSQL) | localhost:5432 |

The client calls `http://localhost:8000`. Rails uses the same `candido` database as Prisma (`DATABASE_URL` on the `backend` service). Do not run `db:migrate` / `db:prepare` against that database.

Stop the stack with `Ctrl+C`, or `./run stop` if it is detached.

The Express app is still in `server/` if you need it:

```bash
docker compose --profile node up server
```

It listens on [http://localhost:8002](http://localhost:8002). Prisma Studio: `./run server:prisma:studio` → [http://localhost:5555](http://localhost:5555).

## Other commands

```bash
./run rspec                    # Rails request/model specs
./run rails <command>         # e.g. ./run rails console
./run bundle:install          # bundle install in the backend container
./run lint                    # RuboCop + ESLint
./run client <command>        # e.g. ./run client npm run build
./run server:prisma <command>  # Prisma CLI against the shared database
```

## Production

Live deploys Rails via `docker-compose.prod.yml` and **Deploy to Production**. The API image is `ghcr.io/<owner>/candido-backend`. Do not run `db:migrate` or `db:prepare` against the Prisma database.

The Next.js API origin is baked in at image build (`NEXT_PUBLIC_API_URL`). Keep that secret equal to the public API URL the browser already uses.

Required GitHub secrets:

| Secret | Notes |
|--------|--------|
| `EC2_HOST`, `EC2_SSH_KEY`, `EC2_APP_PATH` | Existing deploy target |
| `NEXT_PUBLIC_API_URL` | Live API origin, baked into the client image |
| `CORS_ORIGIN` | Live site origin, e.g. `https://candidohq.com` |
| `SECRET_KEY_BASE` | Rails only. Generate with `./run rails secret` |
| `DATABASE_URL` | Same Postgres URL Prisma uses |
| `AWS_BUCKET_NAME`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Existing uploads bucket |
| `BREVO_SMTP_LOGIN`, `BREVO_SMTP_KEY` | Verification / feedback email |

Rollback to Express (images stay on the box; `candido-server:latest` on GHCR is left untouched):

```bash
docker-compose -f docker-compose.prod.yml --env-file backend/.env down
docker-compose -f docker-compose.prod.express.yml --env-file server/.env up -d
```

An optional second instance can still use **Deploy Rails (test instance)** (`EC2_RAILS_HOST`, `EC2_RAILS_APP_PATH`, `NEXT_PUBLIC_RAILS_API_URL`).
