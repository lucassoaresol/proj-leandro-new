-- up
CREATE TABLE "project_object_criteria" (
  "id" SERIAL PRIMARY KEY,
  "value" NUMERIC NOT NULL,
  "object_id" INTEGER NOT NULL,
  "criteria_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "project_object_criteria_object_id_criteria_id_unique" UNIQUE ("object_id","criteria_id"),
  CONSTRAINT "project_object_criteria_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "project_objects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "project_object_criteria_criteria_id_fkey" FOREIGN KEY ("criteria_id") REFERENCES "project_criteria" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TRIGGER update_project_object_criteria_updated_at
BEFORE UPDATE ON "project_object_criteria"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- down
DROP TRIGGER IF EXISTS update_project_object_criteria_updated_at ON "project_object_criteria";

DROP TABLE IF EXISTS "project_object_criteria";
