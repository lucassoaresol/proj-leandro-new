-- up
CREATE TABLE "project_managers" (
  "id" SERIAL PRIMARY KEY,
  "importance_weight" INTEGER NOT NULL DEFAULT 1,
  "project_id" INTEGER NOT NULL,
  "manager_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "project_managers_project_id_manager_id_unique" UNIQUE ("project_id","manager_id"),
  CONSTRAINT "project_managers_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "project_managers_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "managers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TRIGGER update_project_managers_updated_at
BEFORE UPDATE ON "project_managers"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- down
DROP TRIGGER IF EXISTS update_project_managers_updated_at ON "project_managers";

DROP TABLE IF EXISTS "project_managers";
