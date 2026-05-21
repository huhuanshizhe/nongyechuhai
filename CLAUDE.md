# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

农业出海 (farmetra) — cross-border B2B platform connecting vetted Chinese agricultural suppliers with global buyers. The `nongyechuhai` directory is the new monorepo re-architecting the project from the original code in `参考仓/`.

**Tech stack:** Node 22, pnpm workspace + Turborepo, Next.js 16 + React 19, Prisma + Neon PostgreSQL, Auth.js v5, next-intl (en/zh), OpenAI SDK.

## Commands

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
corepack pnpm install

# Development (ports auto-picked in 4000–5000 range)
corepack pnpm dev:web        # Public storefront — port ~4000
corepack pnpm dev:admin      # Admin backend — port ~4100
corepack pnpm dev:supplier   # Supplier workspace — port ~4200

# Build / check
corepack pnpm build
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm format

# Database (operates on packages/db)
corepack pnpm db:generate    # prisma generate
corepack pnpm db:migrate     # prisma migrate dev
corepack pnpm db:seed        # tsx prisma/seed.ts
```

## Architecture

### Monorepo layout

```
apps/
  web/         @nongyechuhai/web      — Public storefront (buyer-facing, i18n)
  admin/       @nongyechuhai/admin    — Admin backend (supplier approval, product governance, inquiries, CMS)
  supplier/    @nongyechuhai/supplier — Supplier workspace (products, inquiries, orders)
packages/
  db/          @nongyechuhai/db       — Prisma client + schema (singleton export)
  auth/        @nongyechuhai/auth     — Auth.js wrapper with role-based access
  config/      @nongyechuhai/config   — Env validation (zod), shared constants
  ai/          @nongyechuhai/ai       — OpenAI client wrapper
  ui/          @nongyechuhai/ui       — Shared components + nav configs
```

### Auth architecture

Each app has its own `src/auth.ts` that calls `createAppAuth({ allowedRoles })` from `@nongyechuhai/auth`. The shared package wraps Auth.js v5 with JWT sessions, Prisma adapter, and role gating:

- **web**: `allowedRoles: ['BUYER']`
- **admin**: `allowedRoles: ['ADMIN']`
- **supplier**: `allowedRoles: ['SUPPLIER']`

The `createAppAuth` function returns the standard `{ handlers, auth, signIn, signOut }` shape. Each app's API route at `src/app/api/auth/[...nextauth]/route.ts` re-exports the handlers.

### App layout patterns

- **web**: `[locale]` route group (`en`/`zh`) with `next-intl` middleware. The root locale layout (`[locale]/layout.tsx`) is a server component that calls `auth()` for session, fetches storefront shell data via `getStorefrontShellData()`, and renders the global header/footer.
- **admin** + **supplier**: Route group layout (`(admin)/layout.tsx`, `(supplier)/layout.tsx`) gate on session role and redirect to `/login` if unauthorized. Both have a sidebar layout.

### Data access pattern

Data-fetching functions live in `lib/` inside each app (e.g., `apps/web/src/lib/storefront.ts`, `apps/admin/src/lib/admin-data.ts`). They:

1. Use Prisma's typed select objects (`Prisma.validator<Prisma.ProductSelect>()`) for type-safe queries.
2. Accept raw Prisma results and map them to app-facing DTO types (e.g., `StorefrontProductCard`, `BuyerAccountData`).
3. Use React `cache()` for deduplication in server components.
4. Format status labels, money, and dates at the mapping layer (not in templates).

The `@nongyechuhai/db` package exports a single `prisma` instance with standard Next.js hot-reload guard (globalThis caching in dev).

### Database (Prisma schema)

Key domain models in `packages/db/prisma/schema.prisma`:

| Model              | Purpose |
|--------------------|---------|
| User, Account, Session | Auth.js identity |
| Organization, OrganizationMember, Supplier | Multi-tenant orgs with supplier profiles |
| ProductCategory, Product, ProductVariant, ProductImage | Product catalog with variants, images, specs (JSON) |
| Inquiry, Quote | RFQ/inquiry workflow with supplier assignment |
| Order, OrderItem, Payment | Transactional ordering (Stripe/Airwallex support) |
| CmsPage, FaqItem | Multilingual content pages and FAQ |
| AiLog | AI usage audit trail |

All enums and tables use `@map()` / `@@map()` for snake_case PostgreSQL naming. Foreign keys use `onDelete: Restrict` for supplier/product integrity and `Cascade` for child entities.

### i18n

The web app uses `next-intl` with `localePrefix: 'always'`. Messages live in `apps/web/messages/{en,zh}.json`. Routing is defined in `apps/web/src/i18n/routing.ts` and middleware in `apps/web/src/middleware.ts`.

### Styling

Plain CSS in `apps/web/src/app/globals.css` — no CSS framework or Tailwind. Styling follows BEM-like naming (`.site-header`, `.site-header__band`, `.site-header__summary`).

### Deployment

Deployed on Vercel. Environment variables defined in `turbo.json` `globalEnv` and validated by `@nongyechuhai/config` (zod schemas).

## Reference repo

`../参考仓/` contains the original codebase this project is replacing. Key differences: that repo uses a mixed pnpm structure with a separate `backend/` (Node.js API), more mature feature set (courses, doctor-business, memberships, etc.), and the admin app is more developed. The reference repo is read-only context — do not modify it.

## Important conventions

- Use `corepack pnpm` instead of bare `pnpm` to ensure correct version.
- All TypeScript config extends `tsconfig.base.json` (strict, ES2022, bundler resolution).
- Pre-commit: Husky + lint-staged runs ESLint and Prettier on staged files.
- Prettier: single quotes, semicolons, trailing commas.
- ESLint: unused vars prefixed with `_` are ignored.
