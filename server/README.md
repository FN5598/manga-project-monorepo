# Dockerfile setup

This Dockerfile uses a multi-stage build to support both development and production deployments from a single file.

## Stages

The Dockerfile is divided into four stages:

- `base`
- `build`
- `development`
- `production`

### Base

The `base` stage starts from a clean Node.js image.

It is responsible for:

- setting the working directory
- copying dependency files, such as `package.json` and `package-lock.json`
- installing project dependencies in a reproducible way

This stage is shared by later stages to avoid repeating setup work.

### Build

The `build` stage extends the base stage.

It is responsible for:

- copying the application source code
- compiling TypeScript into JavaScript
- generating the final `dist` folder

The `dist` folder is used by the runtime stages.

### Development

The `development` stage is used for local development.

It can include:

- development dependencies
- hot reload tooling
- debugging tools
- source maps
- development-specific environment variables

This stage is optimized for fast feedback while working on the app.

### Production

The `production` stage is used for deployed environments.

It should include only what is required to run the compiled app:

- production dependencies
- compiled JavaScript from the dist folder
- required runtime files

This keeps the production image smaller, cleaner, and safer.
