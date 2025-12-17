import { FastifyPluginAsync } from "fastify";

import { CreateObjectController } from "./controllers/CreateObjectController";
import { ExcludeObjectController } from "./controllers/ExcludeObjectController";
import { GetObjectByPublicIdController } from "./controllers/GetObjectByPublicIdController";
import { ListObjectController } from "./controllers/ListObjectController";
import { RetrieveObjectController } from "./controllers/RetrieveObjectController";
import { UpdateObjectController } from "./controllers/UpdateObjectController";

const objectRouter: FastifyPluginAsync = async (fastify) => {
  fastify.get("/public/:publicId", GetObjectByPublicIdController.handle);

  fastify.post("", CreateObjectController.handle);

  fastify.get("", ListObjectController.handle);

  fastify.get("/retrieve", RetrieveObjectController.handle);

  fastify.patch("/:id", UpdateObjectController.handle);

  fastify.delete("/:id", ExcludeObjectController.handle);
};

export default objectRouter;
