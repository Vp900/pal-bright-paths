````markdown
Backend

- Files: `supabase/` (functions, migrations, config)
- To work with Supabase locally, see Supabase CLI docs. Example:

```powershell
cd backend
# Inspect supabase/ folder
Get-ChildItem -Recurse supabase | Select-Object -First 50
```

MongoDB (example)

1. Install the official driver in the backend folder:

```powershell
cd backend
npm install mongodb
```

2. Set environment variables (use a secure method in production):

- `MONGODB_URI` (e.g. `mongodb://localhost:27017`)
- `MONGODB_DB` (database name)

3. Example helper is provided at `backend/mongo-client.ts` — it exports `connect()`, `getDb()` and `close()`.

If you want a backend package.json, edit `backend/package.json` (copied from root).
````
