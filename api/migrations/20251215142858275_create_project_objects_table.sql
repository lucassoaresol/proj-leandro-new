-- up
CREATE TABLE "project_objects" (
  "id" SERIAL PRIMARY KEY,
  "project_id" INTEGER NOT NULL,
  "object_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "project_objects_project_id_object_id_unique" UNIQUE ("project_id","object_id"),
  CONSTRAINT "project_objects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "project_objects_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TRIGGER update_project_objects_updated_at
BEFORE UPDATE ON "project_objects"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- down
DROP TRIGGER IF EXISTS update_project_objects_updated_at ON "project_objects";

DROP TABLE IF EXISTS "project_objects";
