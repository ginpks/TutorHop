-- Fix sequence issues for auto-incrementing primary keys
-- This script resets all sequences to the correct values based on existing data

-- Fix meeting_requests sequence
SELECT setval(
  pg_get_serial_sequence('meeting_requests', 'id'),
  COALESCE((SELECT MAX(id) FROM meeting_requests), 0) + 1,
  false
);

-- Fix users sequence (just in case)
SELECT setval(
  'users_id_seq',
  COALESCE((SELECT MAX(id) FROM users), 0) + 1,
  false
);

-- Fix subjects sequence (just in case)
SELECT setval(
  pg_get_serial_sequence('subjects', 'id'),
  COALESCE((SELECT MAX(id) FROM subjects), 0) + 1,
  false
);

-- Fix availability_slots sequence (just in case)
SELECT setval(
  pg_get_serial_sequence('availability_slots', 'id'),
  COALESCE((SELECT MAX(id) FROM availability_slots), 0) + 1,
  false
);

-- Verify the sequences are correct
SELECT 'meeting_requests' as table_name, last_value as next_id FROM pg_get_serial_sequence('meeting_requests', 'id')::regclass
UNION ALL
SELECT 'users', last_value FROM 'users_id_seq'::regclass
UNION ALL
SELECT 'subjects', last_value FROM pg_get_serial_sequence('subjects', 'id')::regclass
UNION ALL
SELECT 'availability_slots', last_value FROM pg_get_serial_sequence('availability_slots', 'id')::regclass;
