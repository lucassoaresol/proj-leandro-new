import { FastifyPluginAsync } from "fastify";

import { CreateManagerController } from "./controllers/CreateManagerController";
import { ExcludeManagerController } from "./controllers/ExcludeManagerController";
import { GetManagerByPublicIdController } from "./controllers/GetManagerByPublicIdController";
import { ListManagerController } from "./controllers/ListManagerController";
import { RetrieveManagerController } from "./controllers/RetrieveManagerController";
import { UpdateManagerController } from "./controllers/UpdateManagerController";

const managerRouter: FastifyPluginAsync = async (fastify) => {
  fastify.get("/public/:publicId", GetManagerByPublicIdController.handle);

  fastify.post("", CreateManagerController.handle);

  fastify.get("", ListManagerController.handle);

  fastify.get("/retrieve", RetrieveManagerController.handle);

  fastify.patch("/:id", UpdateManagerController.handle);

  fastify.delete("/:id", ExcludeManagerController.handle);
};

export default managerRouter;
