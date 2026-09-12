# KhataFX — Multi-Currency Trade Khata

Starter codebase. Two parts:

- `/mobile` — React Native (Expo) app with WatermelonDB for offline-first local storage
- `/backend` — Node.js + Express + Postgres API for sync, auth, and FX rates

## What's already built here
- Local database schema (parties, transactions, currencies)
- Two working screens: Home (ledger list) and New Entry (multi-currency entry with FX rate lock)
- Backend skeleton with Postgres schema and a starter FX-rate endpoint

## What YOU need to do to run this (see previous message for full manual checklist)
1. Install Node.js (v18+) on your machine — https://nodejs.org
2. `cd mobile && npm install` then `npx expo start` (needs Expo CLI — installs automatically via npx)
3. `cd backend && npm install` then set up a Postgres database (local, or a free Supabase project) and add its connection string to `backend/.env`
4. Run `psql <your-db-url> -f backend/src/db/schema.sql` to create the tables
5. `cd backend && npm run dev` to start the API
6. Get a free API key from https://exchangerate.host or https://openexchangerates.org and add it to `backend/.env` as `FX_API_KEY`

## Folder structure
```
khatafx/
  mobile/
    App.js
    src/
      db/           <- WatermelonDB schema + models (local offline storage)
      screens/       <- HomeScreen, NewEntryScreen
      navigation/
  backend/
    src/
      index.js       <- Express server entry point
      routes/        <- API routes (parties, transactions, fx-rates)
      db/schema.sql   <- Postgres table definitions
```

## Next steps once this runs locally
- Wire up Supabase auth (phone OTP) — see comments in `backend/src/index.js`
- Add the sync logic between WatermelonDB and the backend (`@nozbe/watermelondb/sync`)
- Add push notifications via Firebase Cloud Messaging
- Add JazzCash/Easypaisa payment integration for subscription billing
