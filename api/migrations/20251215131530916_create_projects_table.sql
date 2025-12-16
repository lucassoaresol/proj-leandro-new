-- up
CREATE OR REPLACE FUNCTION generate_projects_public_id()
RETURNS TEXT AS $$
BEGIN
    RETURN generate_unique_public_id('projects');
END;
$$ LANGUAGE plpgsql;

CREATE TABLE "projects" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "started_at" TIMESTAMP(3),
  "ended_at" TIMESTAMP(3),
  "public_id" TEXT NOT NULL UNIQUE DEFAULT generate_projects_public_id(),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON "projects"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- down
DROP TRIGGER IF EXISTS update_projects_updated_at ON "projects";

DROP TABLE IF EXISTS "projects";

DROP FUNCTION IF EXISTS generate_projects_public_id();
