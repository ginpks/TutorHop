# Database Sequence Fix

## Problem

If you encounter this error when creating meeting requests:

```
duplicate key value violates unique constraint "meeting_requests_pkey"
Key (id)=(7) already exists.
```

This means your PostgreSQL sequences (auto-increment counters) are out of sync with the actual data in your tables.

## 🔥 Using Supabase?

**See [SUPABASE-FIX.md](SUPABASE-FIX.md) for Supabase-specific instructions** (easiest method: use the SQL Editor in your Supabase dashboard)

## Why This Happens

This typically occurs when:

- Data was manually inserted into the database without using the default sequence
- Data was imported from another source
- The database was restored from a backup
- Test data was inserted directly

## Solution

### Option 1: Run the Node.js Script (Recommended)

```bash
node fix-sequences.js
```

This script will automatically:

- Connect to your database
- Fix all sequences for tables with auto-incrementing IDs
- Verify the sequences are correct

### Option 2: Run the SQL Script Manually

If you prefer to use a database client (like pgAdmin, DBeaver, or psql):

```bash
psql -U your_username -d your_database -f fix-sequences.sql
```

Or copy and paste the contents of `fix-sequences.sql` into your database client.

## What Gets Fixed

The scripts fix sequences for these tables:

- `meeting_requests`
- `users`
- `subjects`
- `availability_slots`

## After Running the Fix

Once the fix is complete:

1. Restart your application server if it's running
2. Try creating a meeting request again
3. The error should be resolved

## Prevention

To prevent this issue in the future:

- Always use the application's API to insert data
- If you need to insert test data directly, make sure to update the sequences afterward
- Use Drizzle ORM's methods for data insertion which handle sequences automatically
