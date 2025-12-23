-- up
CREATE TABLE "project_criterion_pairwise_evaluations" (
  "id" SERIAL PRIMARY KEY,
  "rating" NUMERIC NOT NULL DEFAULT 1,
  "manager_id" INTEGER NOT NULL,
  "criterion_a_id" INTEGER NOT NULL,
  "criterion_b_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "project_criterion_pairwise_evaluations_manager_id_criterion_a_id_criterion_b_id_unique" UNIQUE ("manager_id","criterion_a_id","criterion_b_id"),
  CONSTRAINT "project_criterion_pairwise_evaluations_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "project_managers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "project_criterion_pairwise_evaluations_criterion_a_id_fkey" FOREIGN KEY ("criterion_a_id") REFERENCES "project_criteria" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "project_criterion_pairwise_evaluations_criterion_b_id_fkey" FOREIGN KEY ("criterion_b_id") REFERENCES "project_criteria" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TRIGGER update_project_criterion_pairwise_evaluations_updated_at
BEFORE UPDATE ON "project_criterion_pairwise_evaluations"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- down
DROP TRIGGER IF EXISTS update_project_criterion_pairwise_evaluations_updated_at ON "project_criterion_pairwise_evaluations";

DROP TABLE IF EXISTS "project_criterion_pairwise_evaluations";
