const fs = require('fs');

const rpc = `
-- Atomic increment for play count to fix race conditions
CREATE OR REPLACE FUNCTION increment_play_count(record_id UUID)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE individual_recordings
  SET play_count = COALESCE(play_count, 0) + 1
  WHERE id = record_id
  RETURNING play_count INTO new_count;

  RETURN new_count;
END;
$$;
`;

const schema = fs.readFileSync('supabase_schema.sql', 'utf8');
if (!schema.includes('increment_play_count')) {
  fs.appendFileSync('supabase_schema.sql', rpc);
  console.log('Added RPC');
} else {
  console.log('Already there');
}
