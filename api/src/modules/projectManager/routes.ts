import { FastifyPluginAsync } from "fastify";

import { CreateProjectManagerController } from "./controllers/CreateProjectManagerController";
import { ExcludeProjectManagerController } from "./controllers/ExcludeProjectManagerController";
import { ListProjectManagerController } from "./controllers/ListProjectManagerController";
import { RetrieveProjectManagerController } from "./controllers/RetrieveProjectManagerController";
import { UpdateProjectManagerController } from "./controllers/UpdateProjectManagerController";

const projectManagerRouter: FastifyPluginAsync = async (fastify) => {
  fastify.post("", CreateProjectManagerController.handle);

  fastify.get("", ListProjectManagerController.handle);

  fastify.get("/retrieve", RetrieveProjectManagerController.handle);

  fastify.patch("/:id", UpdateProjectManagerController.handle);

  fastify.delete("/:id", ExcludeProjectManagerController.handle);
};

export default projectManagerRouter;
