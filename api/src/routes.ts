import { FastifyPluginAsync } from "fastify";

import criteriaRouter from "./modules/criteria/routes";
import groupRouter from "./modules/group/routes";
import managerRouter from "./modules/manager/routes";
import objectRouter from "./modules/object/routes";
import projectRouter from "./modules/project/routes";
import projectCriteriaRouter from "./modules/projectCriteria/routes";
import projectCriterionPairwiseEvaluationRouter from "./modules/projectCriterionPairwiseEvaluation/routes";
import projectManagerRouter from "./modules/projectManager/routes";
import projectObjectRouter from "./modules/projectObject/routes";
import projectObjectCriteriaRouter from "./modules/projectObjectCriteria/routes";

const router: FastifyPluginAsync = async (fastify) => {
  fastify.register(managerRouter, { prefix: "/managers" });
  fastify.register(projectRouter, { prefix: "/projects" });
  fastify.register(projectManagerRouter, { prefix: "/project-managers" });
  fastify.register(criteriaRouter, { prefix: "/criteria" });
  fastify.register(projectCriteriaRouter, { prefix: "/project-criteria" });
  fastify.register(projectCriterionPairwiseEvaluationRouter, {
    prefix: "/project-criterion-pairwise-evaluations",
  });
  fastify.register(groupRouter, { prefix: "/groups" });
  fastify.register(objectRouter, { prefix: "/objects" });
  fastify.register(projectObjectRouter, { prefix: "/project-objects" });
  fastify.register(projectObjectCriteriaRouter, {
    prefix: "/project-object-criteria",
  });
};

export default router;
