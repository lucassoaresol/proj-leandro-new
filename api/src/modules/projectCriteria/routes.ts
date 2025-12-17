import { FastifyPluginAsync } from "fastify";

import { CreateProjectCriteriaController } from "./controllers/CreateProjectCriteriaController";
import { ExcludeProjectCriteriaController } from "./controllers/ExcludeProjectCriteriaController";
import { ListProjectCriteriaController } from "./controllers/ListProjectCriteriaController";
import { RetrieveProjectCriteriaController } from "./controllers/RetrieveProjectCriteriaController";
import { UpdateProjectCriteriaController } from "./controllers/UpdateProjectCriteriaController";

const projectCriteriaRouter: FastifyPluginAsync = async (fastify) => {
  fastify.post("", CreateProjectCriteriaController.handle);

  fastify.get("", ListProjectCriteriaController.handle);

  fastify.get("/retrieve", RetrieveProjectCriteriaController.handle);

  fastify.patch("/:id", UpdateProjectCriteriaController.handle);

  fastify.delete("/:id", ExcludeProjectCriteriaController.handle);
};

export default projectCriteriaRouter;
