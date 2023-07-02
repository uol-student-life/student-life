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

## Database Schema Migration (Atlas)

This project uses declarative database schema migration using [Atlas](https://atlasgo.io/).

All schemas are defined in `./database` directory. Refer to [HCL Schema Reference](https://atlasgo.io/atlas-schema/hcl) for more information.

To install the Atlas CLI, refer to [Atlas CLI](https://atlasgo.io/getting-started).

To apply schema migration in your local environment, run:

```bash
atlas schema apply --env dev
```

By default, atlas will apply schema migration to your mysql instance running on your `localhost` at port `3306` with username `root` and password `password`.

You can specify a different value by adding `--var host={} port={} username={} password={}` flag. The above command is equivalent to:

```bash
atlas schema apply --env dev --var host=localhost port=3306 username=root password=password
```
