-- up
CREATE TYPE project_status AS ENUM ('OPEN', 'FINISHED', 'CANCELED');

ALTER TABLE "projects"
ADD COLUMN "status" project_status NOT NULL DEFAULT 'OPEN';

-- down
ALTER TABLE "projects"
DROP COLUMN IF EXISTS "status";

DROP TYPE IF EXISTS project_status;
