# Quick Fix - Just Copy & Paste! 🚀

## The Easiest Way (No Installation Required)

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project: `iycjickelelgmcdkztkl` (based on your connection string)
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy and Paste This SQL

```sql
-- Fix all sequences at once
SELECT setval(
  pg_get_serial_sequence('meeting_requests', 'id'),
  COALESCE((SELECT MAX(id) FROM meeting_requests), 0) + 1,
  false
);

SELECT setval(
  'users_id_seq',
  COALESCE((SELECT MAX(id) FROM users), 0) + 1,
  false
);

SELECT setval(
  pg_get_serial_sequence('subjects', 'id'),
  COALESCE((SELECT MAX(id) FROM subjects), 0) + 1,
  false
);

SELECT setval(
  pg_get_serial_sequence('availability_slots', 'id'),
  COALESCE((SELECT MAX(id) FROM availability_slots), 0) + 1,
  false
);
```

### Step 3: Run It

- Click **RUN** button (or press `Ctrl+Enter`)
- You should see 4 success results

### Step 4: Test

- Try creating a meeting request again
- It should work! ✅

---

## Alternative: Using Command Line

If you want to use CMD with psql:

```cmd
psql "postgresql://postgres.iycjickelelgmcdkztkl:2iWpA6dUyRRL%7q@aws-1-us-east-2.pooler.supabase.com:5432/postgres" -f fix-sequences.sql
```

**Note:** Changed port from `6543` to `5432` and removed `?pgbouncer=true` for direct connection.

---

## That's It!

The sequences are now fixed and you can create meeting requests without errors.
