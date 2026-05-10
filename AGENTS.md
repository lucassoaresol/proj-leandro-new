# Repository Guidelines

## Project Domain
This repository supports a hospital equipment purchase prioritization system.
The product ranks purchase requests across purchase plans using criteria,
roles, areas, AHP evaluations, and a final TOPSIS ranking. Preserve these
business rules when changing behavior: main profiles are `ADMIN`,
`PLANNING_MANAGER`, and `COMMON_USER`; plan statuses are `OPEN`, `FINISHED`,
and `CANCELED`.

## Project Structure
The backend lives in `api/` and uses Fastify with TypeScript. Domain modules
are under `api/src/modules/<domain>/`, typically split into `controllers/`,
`useCases/`, `routes.ts`, `schemas.ts`, and `interfaces.ts`. SQL migrations
are in `api/migrations/`. The frontend lives in `app/` and uses React with
Vite; UI components are in `app/components/`, API clients in `app/services/`,
and shared types/constants in `app/types.ts` and `app/constants.tsx`.

## Domain Rules
AHP uses pairwise comparison with Saaty values `1`, `3`, `5`, `7`, and `9`,
including reciprocal values. The consistency ratio (CR) must be calculated and
must not exceed `0.1`. TOPSIS generates the final priority ranking, where a
higher score means higher equipment purchase priority.

## Development Commands
Use pnpm in each subproject. Backend: `cd api && pnpm install`,
`pnpm dev`, `pnpm build`, `pnpm lint`. Frontend: `cd app && pnpm install`,
`pnpm dev`, `pnpm build`, `pnpm preview`. Do not invent test commands; no test
script is currently defined.

## Coding Style
Use English for internal identifiers, code, tables, APIs, and functions. Use
Portuguese for user-visible text. API linting enforces Prettier, 88-character
lines, sorted imports, no `.ts` import extensions, and `I*` interface names.
Follow existing naming: PascalCase React components and camelCase services.

## Testing and Review
Before submitting, run the relevant build and, for API changes, `pnpm lint`.
Add focused tests only when a test setup exists or is intentionally introduced.
Commits follow Conventional Commits, such as `feat:` or `feat(project):`.

## Security
Never expose secrets, credentials, `.env` values, API keys, or database
connection strings in code, docs, logs, commits, or pull requests.
