-- up
CREATE OR REPLACE FUNCTION generate_groups_public_id()
RETURNS TEXT AS $$
BEGIN
    RETURN generate_unique_public_id('groups');
END;
$$ LANGUAGE plpgsql;

CREATE TABLE "groups" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "public_id" TEXT NOT NULL UNIQUE DEFAULT generate_groups_public_id(),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_groups_updated_at
BEFORE UPDATE ON "groups"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- down
DROP TRIGGER IF EXISTS update_groups_updated_at ON "groups";

DROP TABLE IF EXISTS "groups";

DROP FUNCTION IF EXISTS generate_groups_public_id();
