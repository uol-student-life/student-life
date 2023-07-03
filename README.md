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
