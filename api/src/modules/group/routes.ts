import { FastifyPluginAsync } from "fastify";

import { CreateGroupController } from "./controllers/CreateGroupController";
import { ExcludeGroupController } from "./controllers/ExcludeGroupController";
import { GetGroupByPublicIdController } from "./controllers/GetGroupByPublicIdController";
import { ListGroupController } from "./controllers/ListGroupController";
import { RetrieveGroupController } from "./controllers/RetrieveGroupController";
import { UpdateGroupController } from "./controllers/UpdateGroupController";

const groupRouter: FastifyPluginAsync = async (fastify) => {
  fastify.get("/public/:publicId", GetGroupByPublicIdController.handle);

  fastify.post("", CreateGroupController.handle);

  fastify.get("", ListGroupController.handle);

  fastify.get("/retrieve", RetrieveGroupController.handle);

  fastify.patch("/:id", UpdateGroupController.handle);

  fastify.delete("/:id", ExcludeGroupController.handle);
};

export default groupRouter;
