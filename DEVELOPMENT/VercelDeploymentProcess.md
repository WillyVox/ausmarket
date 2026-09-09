I looked at the project's specifics (Prisma+Postgres, NextAuth v5 beta, optional TwelveData key) so this is tailored to your actual codebase, not generic advice. One real fix first, then the steps.Now the deployment walkthrough.

## 1. Push the code to a Git repo

Vercel deploys from GitHub, GitLab, or Bitbucket. Get this project into a repo (not the zip) and push it — Vercel builds from a commit, not an upload.

```
git init
git add -A
git commit -m "initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

## 2. Provision a Postgres database

`schema.prisma` targets `provider = "postgresql"`, and there's no SQLite fallback — you need a real Postgres instance reachable from Vercel's build/runtime before anything that touches the DB will work. Easiest options, any of which give you a connection string:

- **Vercel Postgres** (or Neon/Supabase, which now power Vercel's marketplace Postgres) — added from the Storage tab in your Vercel project, env vars get wired in automatically.
- **Neon** or **Supabase** directly — create a project, copy the pooled connection string.

Either way, end up with a `DATABASE_URL` like `postgresql://user:pass@host:5432/db?sslmode=require`.

## 3. Set environment variables in Vercel

Project → Settings → Environment Variables:

| Variable | Required? | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | From step 2. Without it, broker/exchange pages still render (they fall back to static data per `src/lib/brokers/repository.ts`), but auth, watchlist, alerts, and saved-articles all need a real DB and will fail. |
| `AUTH_SECRET` | Yes | NextAuth v5 (Auth.js) uses `AUTH_SECRET`, not the old `NEXTAUTH_SECRET`. Generate one with `npx auth secret` or `openssl rand -base64 32`. |
| `TWELVE_DATA_API_KEY` | Optional | Enables live ASX stock quotes (free tier at twelvedata.com). Without it, `/stocks/[symbol]` falls back to mock data. |

You generally don't need `AUTH_URL`/`NEXTAUTH_URL` on Vercel — Auth.js auto-detects the host there. Only set it if you're on a custom domain and see redirect issues.

## 4. Configure the build

I added `"postinstall": "prisma generate"` to `package.json` just now — this is the standard fix for a real gotcha: Vercel caches `node_modules` between builds, and on a cache hit it can skip install scripts, leaving a stale/missing Prisma Client even though `@prisma/client` normally self-generates on install. With the explicit `postinstall` hook, this runs every build regardless of cache state.

Leave the Vercel build command as default (`next build` — actually `npm run build`, unchanged). Framework preset: Next.js (auto-detected).

## 5. Run migrations against the production database

Vercel has no built-in "run this before deploy" step for databases, so pick one:

- **Simplest**: from your machine, point `DATABASE_URL` at the production DB and run `npx prisma migrate deploy` once before (or right after) the first deploy. Repeat after each schema change.
- **Automated**: change the Vercel build command to `npx prisma migrate deploy && next build`. This applies pending migrations on every deploy — fine for a solo/small project, riskier for a team (concurrent deploys racing migrations).

Either way, use `migrate deploy` (applies existing migration files), not `migrate dev` (that one prompts interactively and can generate new migrations — wrong for CI/prod).

## 6. Seed the database (optional, once)

```
DATABASE_URL="<your prod url>" npm run db:seed
```

This loads the broker/exchange content from `static-data.ts`. Skippable — the app works without it, just with fewer real rows (broker/exchange pages fall back to the bundled static content).

## 7. Deploy

- Import the repo at vercel.com/new, or `vercel` / `vercel --prod` via the CLI.
- Watch the build logs for the `prisma generate` line to confirm the client built successfully.

## 8. Verify after deploy

- `/` and `/crypto` — live CoinGecko/Frankfurter data, no config needed.
- `/register` → `/login` — exercises `AUTH_SECRET` + `DATABASE_URL`.
- `/watchlist`, alerts — exercises the DB-backed repositories that have no static fallback (per the comment in `watchlist/repository.ts`, a DB failure here throws rather than degrading).
- `/methodology` — its "Transparency Snapshot" honestly reports whether it's reading live DB data or fallback content, so it doubles as a quick health check.

One more thing worth knowing before you deploy: `next` is pinned to `^16.3.4`, which is a very recent/canary line — worth pinning to an exact known-good version rather than `^` if you want reproducible builds, since a caret range could pull in a newer canary on a fresh install.