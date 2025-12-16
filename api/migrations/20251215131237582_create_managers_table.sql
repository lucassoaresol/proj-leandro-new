-- up
CREATE OR REPLACE FUNCTION generate_managers_public_id()
RETURNS TEXT AS $$
BEGIN
    RETURN generate_unique_public_id('managers');
END;
$$ LANGUAGE plpgsql;

CREATE TABLE "managers" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "public_id" TEXT NOT NULL UNIQUE DEFAULT generate_managers_public_id(),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_managers_updated_at
BEFORE UPDATE ON "managers"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- down
DROP TRIGGER IF EXISTS update_managers_updated_at ON "managers";

DROP TABLE IF EXISTS "managers";

DROP FUNCTION IF EXISTS generate_managers_public_id();
