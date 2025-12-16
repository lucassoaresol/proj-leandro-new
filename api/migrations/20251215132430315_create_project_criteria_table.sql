-- up
CREATE TYPE project_criteria_optimization_goal AS ENUM ('MAXIMIZE', 'MINIMIZE');

CREATE TABLE "project_criteria" (
  "id" SERIAL PRIMARY KEY,
  "optimization_goal" project_criteria_optimization_goal NOT NULL,
  "project_id" INTEGER NOT NULL,
  "criteria_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "project_criteria_project_id_criteria_id_unique" UNIQUE ("project_id","criteria_id"),
  CONSTRAINT "project_criteria_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "project_criteria_criteria_id_fkey" FOREIGN KEY ("criteria_id") REFERENCES "criteria" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TRIGGER update_project_criteria_updated_at
BEFORE UPDATE ON "project_criteria"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- down
DROP TRIGGER IF EXISTS update_project_criteria_updated_at ON "project_criteria";

DROP TABLE IF EXISTS "project_criteria";

DROP TYPE IF EXISTS project_criteria_optimization_goal;
