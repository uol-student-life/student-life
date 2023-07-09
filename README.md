# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Requirements

You will need the following:

- [Node.js](https://nodejs.org/en/download/) (v16 or newer)

Recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage your Node.js versions.

To install nvm, run:

> Mac (with homebrew)

```bash
brew install nvm
```

> Windows (with chocolatey)

```bash
choco install nvm
```

To install Node.js v16 with nvm, run:

```bash
nvm install 16
```

To use Node.js v16 with nvm, run:

```bash
nvm use 16
```

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Prisma Schema Migration

This project uses [Prisma](https://www.prisma.io) ORM.

All schemas are defined in `prisma/schema.prisma`. Refer to [Prisma Schema – Data Model](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model) for more information.

To start up Prisma Studio, run:

> Prisma Studio is a visual editor for the data in your database.

```bash
npx prisma studio
```

To apply schema changes, run:

```bash
npx prisma migrate dev
```

To generate and apply new migration after you change your schema, run:

```bash
npx prisma migrate dev --name <migration-name>
```

You can also pass in `--create-only` flag to only generate migration without applying it.

## Deploy with Docker Compose

The compose file defines the main application service `student-life-nuxt` along with three dependent services:

* `mysql`: provides a MySQL database server instance.
* `s3`: provides an AWS S3 compatible MinIO object storage server instance. 
* `minioclient`: runs MinIO Client (mc) commands for setting up an object bucket and access policy for the app.

Before running the whole application stack using the following command:
* Please copy `docker.env.example` file to a new one named `docker.env` and change its values suitable for your environment.
* Make sure the exposed ports are not already being in use on the host.

```
$ docker compose -f ./docker-compose.full.yaml up -d
```

### Expected result

Listing containers should show three containers running and the port mapping as below:

```
$ docker compose ps
NAME                               IMAGE                                      COMMAND                  SERVICE             CREATED             STATUS                    PORTS
student-life-mysql-1               mysql:8.0.30                               "docker-entrypoint.s…"   mysql               27 minutes ago      Up 27 minutes (healthy)   0.0.0.0:3306->3306/tcp, 33060/tcp
student-life-s3-1                  minio/minio:RELEASE.2023-07-07T07-13-57Z   "sh -c 'minio server…"   s3                  27 minutes ago      Up 27 minutes (healthy)   0.0.0.0:9000-9001->9000-9001/tcp
student-life-student-life-nuxt-1   uolstudentlife/student-life:latest         "node /app/.output/s…"   student-life-nuxt   27 minutes ago      Up 27 minutes             0.0.0.0:3000->80/tcp
```

After the application starts, navigate to `http://localhost:3000` in your web browser.

You also might want to build the application image locally rather than pulling a pre-built one from Docker Hub registry:

```
$ docker compose -f ./docker-compose.full.yaml up -d --build
```

For supporting local development, we provide `docker-compose.yaml` without the main application service included.

### Clean up

Stop and remove the containers

```
$ docker compose down
```
