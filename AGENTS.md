# AGENTS.md

Guidance for Codex working in this repository.

## Project Overview

**IBM Immobilière** (Immobilière Ben Mokhtar) — a real estate website for residential and commercial property listings in Tunisia. Content is primarily in **French** (`<html lang="fr">`).

**Tech stack:**
- Next.js 15 (App Router) + React 19, TypeScript 5.8 (strict)
- MongoDB via Mongoose 8
- Tailwind CSS 4 (PostCSS plugin) + custom `app/globals.css`
- Forms: React Hook Form + Zod (`@hookform/resolvers`)
- State: Zustand
- Animations: Framer Motion
- i18n: `next-intl` (installed; French is the only active locale)
- Images: Sharp + Next.js `<Image>` (remote `https://**` allowed)
- Markdown: `react-markdown` + `remark-gfm` + `rehype-sanitize` (used in blog posts)

## Architecture

```
app/                      # App Router pages
  layout.tsx              # Root layout, French metadata
  page.tsx                # Homepage
  loading.tsx, error.tsx, not-found.tsx
  globals.css             # Tailwind entry + globals
  proprietes/             # Properties listing
    [id]/                 # Property detail (by Mongo ObjectId)
  projets/                # Projects listing
    [slug]/               # Project detail (by slug)
  blog/                   # Blog listing
    [slug]/               # Blog post
  a-propos/               # About
  contact/                # Contact

components/               # Flat shared UI components (no subfolders)
  Header, Footer, PropertyCard, ProjectCard, BlogCard,
  SearchBar, SortSelect, StatsCounter, TestimonialCarousel

lib/
  db/mongodb.ts           # Mongoose singleton w/ global cache (connectDB)
  models/                 # Mongoose schemas: Property, Project, BlogPost,
                          # Partner, Testimonial
  actions/                # 'use server' Server Actions: blog, contact,
                          # projects, properties, testimonials
  types/index.ts          # Plain TS types (PropertyType, ProjectType,
                          # BlogPostType, TestimonialType, SearchFilters,
                          # ContactFormData)
  utils/serialize.ts      # serializeDoc / serializeDocs — converts Mongoose
                          # docs to plain JSON-safe objects (_id -> id,
                          # Dates -> ISO, strips __v, recurses)
  seed/seed.txt           # placeholder; real seeder is scripts/seed-standalone.js

scripts/seed-standalone.js  # Standalone Mongoose seeder (no ts-node)
public/                     # Static assets
dist/                       # Build output (do not edit)
```

**Data flow:** Server Components / pages call Server Actions in `lib/actions/*` → `connectDB()` → Mongoose `Model.find(...).lean()` → `serializeDoc()` → typed plain objects from `lib/types`. Pages render with these. `submitContactForm` currently only logs to console (no email/persistence yet).

## Key Conventions

- **Path aliases** (tsconfig): `@/*`, `@/app/*`, `@/components/*`, `@/lib/*`. Always import via aliases, not relative `../../`.
- **Always serialize Mongoose docs** before returning from Server Actions or passing to Client Components — use `serializeDoc(s)` from `lib/utils/serialize.ts`. Never return raw Mongoose docs (Dates, ObjectIds, Buffers break client serialization).
- **Server Actions**: every file in `lib/actions/` starts with `'use server';`. They `await connectDB()` first, wrap in `try/catch`, and return safe defaults (`[]`, `null`, `{ success: false }`) on error rather than throwing.
- **Models**: use `models.X || model<IX>('X', ...)` pattern to survive Next.js hot reloads. Add Mongoose indexes inline in the schema file.
- **IDs in URLs**: properties use Mongo `ObjectId` (`/proprietes/[id]`); projects and blog posts use `slug` (`/projets/[slug]`, `/blog/[slug]`). Validate ObjectIds with `mongoose.Types.ObjectId.isValid` before querying.
- **Language**: French copy in UI strings, French route segments (`proprietes`, `projets`, `a-propos`). Keep new user-facing text in French.
- **Components**: flat in `components/`, PascalCase filenames, default exports, Tailwind for styling.

## Commands

```bash
npm run dev      # next dev (port 5000, see replit.md)
npm run build    # next build
npm run start    # next start
npm run lint     # next lint (eslint-config-next)
npm run seed     # ts-node lib/seed/seed.ts  (NOTE: lib/seed/ only contains seed.txt;
                 # this script is currently broken — use the standalone seeder below)

# Working seeder:
node scripts/seed-standalone.js           # seed sample Tunisian data
node scripts/seed-standalone.js --fresh   # wipe collections first
```

## Environment

Set in `.env.local` (not committed):

- `MONGODB_URI` — MongoDB connection string. Defaults to `mongodb://localhost:27017/ibm-immobiliere` if unset.
- `NEXT_PUBLIC_APP_URL` — public app URL (referenced in docs; not enforced in code yet).

**External services:** MongoDB only. No email/auth/payment integrations are wired up.

## Gotchas

- `npm run seed` points at `lib/seed/seed.ts` which does not exist (only `seed.txt` is present). Use `node scripts/seed-standalone.js` instead, or restore the TS seeder before running the npm script.
- Dev server runs on **port 5000**, not Next's default 3000 (legacy from Replit hosting — see `replit.md`).
- `next.config.ts` allows images from `https://**` (any HTTPS host) — be aware when reviewing image src URLs.
- Server Actions have a `bodySizeLimit: '10mb'` (configured in `next.config.ts`) for future file uploads.
- `submitContactForm` is a stub — it validates and `console.log`s only. No DB write or email is sent. Wire up before relying on it.
- `lib/db/mongodb.ts` uses a `global.mongoose` cache to survive HMR; do not refactor away the global without preserving this behavior or you'll exhaust connections.
- TypeScript is `strict`, but Server Actions in `lib/actions/*` use `any` casts around the serializer return — don't trust the runtime shape blindly; cross-check against `lib/types/index.ts`.
- `replit.md` is detailed but partly aspirational (Phase 3+ tasks list features that may not all be implemented). Treat the actual code as the source of truth.
- Project is mid-development; expect missing pieces (admin panel, auth, real contact backend, full i18n wiring) rather than assuming they exist.
