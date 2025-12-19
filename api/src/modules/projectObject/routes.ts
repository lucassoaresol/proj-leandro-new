import { FastifyPluginAsync } from "fastify";

import { CreateProjectObjectController } from "./controllers/CreateProjectObjectController";
import { ExcludeProjectObjectController } from "./controllers/ExcludeProjectObjectController";
import { ListProjectObjectController } from "./controllers/ListProjectObjectController";
import { RetrieveProjectObjectController } from "./controllers/RetrieveProjectObjectController";

const projectObjectRouter: FastifyPluginAsync = async (fastify) => {
  fastify.post("", CreateProjectObjectController.handle);

  fastify.get("", ListProjectObjectController.handle);

  fastify.get("/retrieve", RetrieveProjectObjectController.handle);

  fastify.delete("/:id", ExcludeProjectObjectController.handle);
};

export default projectObjectRouter;
