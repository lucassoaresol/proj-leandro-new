import { FastifyPluginAsync } from "fastify";

import { CreateProjectController } from "./controllers/CreateProjectController";
import { ExcludeProjectController } from "./controllers/ExcludeProjectController";
import { GetProjectByPublicIdController } from "./controllers/GetProjectByPublicIdController";
import { ListProjectController } from "./controllers/ListProjectController";
import { RetrieveProjectController } from "./controllers/RetrieveProjectController";
import { UpdateProjectController } from "./controllers/UpdateProjectController";

const projectRouter: FastifyPluginAsync = async (fastify) => {
  fastify.get("/public/:publicId", GetProjectByPublicIdController.handle);

  fastify.post("", CreateProjectController.handle);

  fastify.get("", ListProjectController.handle);

  fastify.get("/retrieve", RetrieveProjectController.handle);

  fastify.patch("/:id", UpdateProjectController.handle);

  fastify.delete("/:id", ExcludeProjectController.handle);
};

export default projectRouter;
