# On Your Macbook 
    Search Docker > Open it > Desktop Docker is running
    $ docker status
# docker run --name ausmarket-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ausmarket -p 5432:5432 -d postgres:16


# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# then edit .env:
#   - DATABASE_URL to point at your Postgres instance
#   - AUTH_SECRET: generate with `openssl rand -base64 32`
#   - TWELVE_DATA_API_KEY is optional (leave blank to use mock ASX quotes)

# 3. (If you don't already have Postgres running) start one, e.g.:
docker run --name ausmarket-db -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ausmarket -p 5432:5432 -d postgres:16

# 4. Generate the Prisma client
npx prisma generate

# 5. Apply all migrations (init → phase4 → phase5 → phase6)
npx prisma migrate dev 20260909061500_phase6_monetization

# 6. Seed the database (brokers, exchanges, ad placements, placeholder sponsored post)
npm run db:seed

# 7. Type-check and lint before trusting the build
npm run typecheck
npm run lint

# 8. Build for production (or skip to step 10 for local dev instead)
npm run build

# 9. Run the production build
npm run start

# --- OR, for local development instead of steps 8–9 ---
npm run dev

# 10. Create your admin account (after registering normally at /register)
npm run make:admin -- you@example.com [huy@mail.com]
npm run make:admin huy@mail.com
[login: 12345678]
# then sign out and back in on the site — role is baked into the JWT at sign-in
# visit /admin