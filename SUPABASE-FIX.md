# Fix Database Sequences on Supabase

## Quick Fix (Easiest Method)

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `fix-sequences.sql` into the editor
6. Click **Run** or press `Ctrl+Enter`
7. You should see success messages for each sequence fixed

### Option 2: Using psql Command Line

#### Step 1: Get your Supabase connection string

1. Go to your Supabase Dashboard
2. Click on **Project Settings** (gear icon)
3. Click on **Database** in the left menu
4. Under **Connection string**, select **URI** (or **Connection pooling**)
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual database password

#### Step 2: Run the SQL script

Open Command Prompt (CMD) and run:

```cmd
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f fix-sequences.sql
```

**Example:**

```cmd
psql "postgresql://postgres:mypassword123@db.abcdefghijklm.supabase.co:5432/postgres" -f fix-sequences.sql
```

#### If psql is not installed:

Download and install PostgreSQL client tools:

- Windows: https://www.postgresql.org/download/windows/
- Or install just the command-line tools from: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

After installation, add PostgreSQL's bin folder to your PATH:

1. Find the installation path (usually `C:\Program Files\PostgreSQL\16\bin`)
2. Add it to your system PATH environment variable
3. Restart Command Prompt

### Option 3: Manual SQL Execution

If you prefer to run the commands manually in Supabase SQL Editor:

```sql
-- Fix meeting_requests sequence
SELECT setval(
  pg_get_serial_sequence('meeting_requests', 'id'),
  COALESCE((SELECT MAX(id) FROM meeting_requests), 0) + 1,
  false
);

-- Fix users sequence
SELECT setval(
  'users_id_seq',
  COALESCE((SELECT MAX(id) FROM users), 0) + 1,
  false
);

-- Fix subjects sequence
SELECT setval(
  pg_get_serial_sequence('subjects', 'id'),
  COALESCE((SELECT MAX(id) FROM subjects), 0) + 1,
  false
);

-- Fix availability_slots sequence
SELECT setval(
  pg_get_serial_sequence('availability_slots', 'id'),
  COALESCE((SELECT MAX(id) FROM availability_slots), 0) + 1,
  false
);
```

## After Running the Fix

1. The sequences are now fixed
2. Try creating a meeting request again
3. It should work without errors!

## Verify the Fix

You can verify the sequences are correct by running this in SQL Editor:

```sql
SELECT
  'meeting_requests' as table_name,
  (SELECT MAX(id) FROM meeting_requests) as max_id,
  currval(pg_get_serial_sequence('meeting_requests', 'id')) as sequence_value
UNION ALL
SELECT
  'users',
  (SELECT MAX(id) FROM users),
  currval('users_id_seq')
UNION ALL
SELECT
  'subjects',
  (SELECT MAX(id) FROM subjects),
  currval(pg_get_serial_sequence('subjects', 'id'))
UNION ALL
SELECT
  'availability_slots',
  (SELECT MAX(id) FROM availability_slots),
  currval(pg_get_serial_sequence('availability_slots', 'id'));
```

The `sequence_value` should be greater than `max_id` for each table.
