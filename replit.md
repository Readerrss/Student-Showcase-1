# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── portfolio/          # Mitadru Karmakar Portfolio (static HTML/CSS/JS/XML)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Portfolio Artifact (artifacts/portfolio)

A personal portfolio website for **Mitadru Karmakar** — B.Tech 3rd Year, BCS 3A, Techno India University.

Built with exactly **4 files** as required:
- `index.html` — Complete single-page portfolio with all 6 sections
- `public/style.css` — All styles with light/dark mode CSS variables
- `public/script.js` — Theme toggle, XML parsing, form validation, scroll animations
- `public/projects.xml` — Structured project data parsed dynamically by JS

### Sections Covered
- **Home** — Hero with stats, CTA buttons
- **About** — Academic profile, info cards
- **Skills** — 6 skill categories with tags
- **Projects** — Dynamically loaded from XML via DOMParser
- **Achievements** — 6 certification/milestone cards
- **Contact** — Form with client-side validation, honeypot bot protection

### Technologies Demonstrated
- HTML5 (semantic structure, meta tags, accessibility)
- CSS3 (CSS variables, flexbox, grid, responsive design, dark mode)
- JavaScript (XML parsing, DOM manipulation, form validation, XSS sanitisation)
- XML (structured data format, parsed client-side)
- Web security: input sanitisation, honeypot fields, CSP awareness

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`).

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec.

### `scripts` (`@workspace/scripts`)

Utility scripts package.
