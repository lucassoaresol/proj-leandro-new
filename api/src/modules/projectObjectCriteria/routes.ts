import { FastifyPluginAsync } from "fastify";

import { CreateProjectObjectCriteriaController } from "./controllers/CreateProjectObjectCriteriaController";
import { ExcludeProjectObjectCriteriaController } from "./controllers/ExcludeProjectObjectCriteriaController";
import { ListProjectObjectCriteriaController } from "./controllers/ListProjectObjectCriteriaController";
import { RetrieveProjectObjectCriteriaController } from "./controllers/RetrieveProjectObjectCriteriaController";
import { UpdateProjectObjectCriteriaController } from "./controllers/UpdateProjectObjectCriteriaController";

const projectObjectCriteriaRouter: FastifyPluginAsync = async (fastify) => {
  fastify.post("", CreateProjectObjectCriteriaController.handle);

  fastify.get("", ListProjectObjectCriteriaController.handle);

  fastify.get("/retrieve", RetrieveProjectObjectCriteriaController.handle);
  fastify.patch("/:id", UpdateProjectObjectCriteriaController.handle);

  fastify.delete("/:id", ExcludeProjectObjectCriteriaController.handle);
};

export default projectObjectCriteriaRouter;
