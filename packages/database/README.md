# Database Package (@packages/database)

This package contains the database schema, Drizzle ORM configuration, and seed scripts for the project.

## Overview

- **Database**: PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Driver**: `drizzle-orm/node-postgres`

## Setup

The database connection requires a `DATABASE_URL` environment variable. In the root `.env` file, ensure you have:

```env
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/postgres
```

## Available Scripts

You can run these scripts from the package directory or via `pnpm` from the workspace root (e.g., `pnpm --filter @packages/database db:generate`).

- `pnpm db:generate`: Generates migration files based on the Drizzle schema in `src/db/schema.ts`.
- `pnpm db:migrate`: Applies pending migrations to the database.
- `pnpm db:seed`: Seeds the database with initial test data.
- `pnpm db:studio`: Opens Drizzle Studio to browse and manage your database graphically.

## Seeding

To quickly test authentication, this package provides a seed script.

Run the seed script:
```bash
pnpm db:seed
```

This will insert a test user into the `users` table with the following credentials:

- **Email:** `test@example.com`
- **Password:** `SecureDemoP@ssw0rd!2026`

These credentials are safe to use for local development and are robust enough to pass basic password strength checks and avoid browser warnings.

## Schema

The schema definition is located in `src/db/schema.ts`. When making changes to the schema, remember to generate and run migrations.
