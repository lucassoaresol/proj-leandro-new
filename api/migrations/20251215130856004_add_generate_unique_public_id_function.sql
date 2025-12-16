-- up
CREATE OR REPLACE FUNCTION generate_unique_public_id(table_name TEXT)
RETURNS TEXT AS $$
DECLARE
    allowed_characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    min_length INT := 3;
    max_length INT := 5;
    public_id TEXT;
    is_unique BOOLEAN := FALSE;
    attempt INT := 0;
    length INT;
BEGIN
    WHILE NOT is_unique AND attempt < 100 LOOP
        length := (random() * (max_length - min_length + 1) + min_length)::INT;

        public_id := (SELECT string_agg(substr(allowed_characters, (random() * length(allowed_characters) + 1)::INT, 1), '')
                      FROM generate_series(1, length));

        EXECUTE format('SELECT NOT EXISTS (SELECT 1 FROM %I WHERE public_id = $1)', table_name) INTO is_unique USING public_id;

        attempt := attempt + 1;
    END LOOP;

    IF NOT is_unique THEN
        RAISE EXCEPTION 'Could not generate a unique public ID after multiple attempts';
    END IF;

    RETURN public_id;
END;
$$ LANGUAGE plpgsql;

-- down
DROP FUNCTION IF EXISTS generate_unique_public_id();
