import { FastifyPluginAsync } from "fastify";

import { CalculateProjectCriterionCRController } from "./controllers/CalculateProjectCriterionCRController";
import { CreateProjectCriterionPairwiseEvaluationController } from "./controllers/CreateProjectCriterionPairwiseEvaluationController";
import { ExcludeProjectCriterionPairwiseEvaluationController } from "./controllers/ExcludeProjectCriterionPairwiseEvaluationController";
import { ListProjectCriterionPairwiseEvaluationController } from "./controllers/ListProjectCriterionPairwiseEvaluationController";
import { RetrieveProjectCriterionPairwiseEvaluationController } from "./controllers/RetrieveProjectCriterionPairwiseEvaluationController";
import { UpdateProjectCriterionPairwiseEvaluationController } from "./controllers/UpdateProjectCriterionPairwiseEvaluationController";

const projectCriterionPairwiseEvaluationRouter: FastifyPluginAsync = async (
  fastify,
) => {
  fastify.post("", CreateProjectCriterionPairwiseEvaluationController.handle);

  fastify.post("/calculate-cr", CalculateProjectCriterionCRController.handle);

  fastify.get("", ListProjectCriterionPairwiseEvaluationController.handle);

  fastify.get(
    "/retrieve",
    RetrieveProjectCriterionPairwiseEvaluationController.handle,
  );
  fastify.patch(
    "/:id",
    UpdateProjectCriterionPairwiseEvaluationController.handle,
  );

  fastify.delete(
    "/:id",
    ExcludeProjectCriterionPairwiseEvaluationController.handle,
  );
};

export default projectCriterionPairwiseEvaluationRouter;
