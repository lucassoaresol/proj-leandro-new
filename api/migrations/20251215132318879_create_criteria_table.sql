-- up
CREATE OR REPLACE FUNCTION generate_criteria_public_id()
RETURNS TEXT AS $$
BEGIN
    RETURN generate_unique_public_id('criteria');
END;
$$ LANGUAGE plpgsql;

CREATE TABLE "criteria" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "public_id" TEXT NOT NULL UNIQUE DEFAULT generate_criteria_public_id(),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_criteria_updated_at
BEFORE UPDATE ON "criteria"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- down
DROP TRIGGER IF EXISTS update_criteria_updated_at ON "criteria";

DROP TABLE IF EXISTS "criteria";

DROP FUNCTION IF EXISTS generate_criteria_public_id();
