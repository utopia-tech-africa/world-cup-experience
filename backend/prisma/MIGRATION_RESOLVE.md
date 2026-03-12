# Full DB reset (no data to keep)

To wipe the database and apply all migrations from scratch:

1. **Point your env to the production DB** (e.g. in `backend/.env`).

2. **Wipe the schema:**
   ```bash
   cd backend
   pnpm prisma db execute --file prisma/reset-schema.sql
   ```

3. **Apply all migrations:**
   ```bash
   pnpm prisma migrate deploy
   ```

If `reset-schema.sql` fails (e.g. permission denied on `DROP SCHEMA`), use your DB provider’s UI to drop and recreate the database (or drop all tables), then run `pnpm prisma migrate deploy`.

---

# Production build and migrations

**Recommended:** Run migrations **separately** from the image build so a bad DB state (e.g. P3009) doesn’t break the build.

- **Build (no DB):**  
  `pnpm install && pnpm prisma generate && pnpm run build`
- **Deploy / release (with DB):**  
  `pnpm prisma migrate deploy`  
  Run this once per deploy (e.g. release command, init container, or before starting the app).

If you keep migrations in the build command, use:

`pnpm install && pnpm prisma generate && pnpm prisma migrate deploy && pnpm run build`

---

# Resolving failed migration in production (P3009)

If the build fails with:

```
Error: P3009
migrate found failed migrations in the target database
The `20260228000000_packages_type_id` migration ... failed
```

**One-time fix in production:** connect to the production DB and mark the failed migration as applied so the rest can run:

```bash
# With DATABASE_URL pointing at your production DB
pnpm prisma migrate resolve --applied 20260228000000_packages_type_id
```

Then re-run your deploy. The later migration `20260303120000_package_types_table` will create `package_types` and add `type_id` to `packages`.

**Why it failed:** This migration runs (by timestamp order) before the `packages` and `package_types` tables exist, so it used to error. The migration SQL was updated to no-op when those tables are missing, so future runs (e.g. fresh DBs) succeed.

---

### If `20260228120000_add_games_table` fails (P3018: relation "package_types" does not exist)

That migration used to add a foreign key to `package_types` before that table existed. It’s now updated to only create the `games` table; the FK is added in `20260303120000_package_types_table` after `package_types` is created.

**One-time fix:** Mark the failed migration as rolled back so it can be re-applied with the new SQL:

```bash
pnpm prisma migrate resolve --rolled-back 20260228120000_add_games_table
```

Then redeploy. If the `games` table was already created (without the FK), the migration uses `CREATE TABLE IF NOT EXISTS` so it will still succeed.
