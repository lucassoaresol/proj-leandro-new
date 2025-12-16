-- up
CREATE OR REPLACE FUNCTION generate_objects_public_id()
RETURNS TEXT AS $$
BEGIN
    RETURN generate_unique_public_id('objects');
END;
$$ LANGUAGE plpgsql;

CREATE TABLE "objects" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "group_id" INTEGER NOT NULL,
  "public_id" TEXT NOT NULL UNIQUE DEFAULT generate_objects_public_id(),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "objects_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TRIGGER update_objects_updated_at
BEFORE UPDATE ON "objects"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- down
DROP TRIGGER IF EXISTS update_objects_updated_at ON "objects";

DROP TABLE IF EXISTS "objects";

DROP FUNCTION IF EXISTS generate_objects_public_id();
