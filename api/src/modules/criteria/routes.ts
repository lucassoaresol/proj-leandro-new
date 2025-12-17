import { FastifyPluginAsync } from "fastify";

import { CreateCriteriaController } from "./controllers/CreateCriteriaController";
import { ExcludeCriteriaController } from "./controllers/ExcludeCriteriaController";
import { GetCriteriaByPublicIdController } from "./controllers/GetCriteriaByPublicIdController";
import { ListCriteriaController } from "./controllers/ListCriteriaController";
import { RetrieveCriteriaController } from "./controllers/RetrieveCriteriaController";
import { UpdateCriteriaController } from "./controllers/UpdateCriteriaController";

const criteriaRouter: FastifyPluginAsync = async (fastify) => {
  fastify.get("/public/:publicId", GetCriteriaByPublicIdController.handle);

  fastify.post("", CreateCriteriaController.handle);

  fastify.get("", ListCriteriaController.handle);

  fastify.get("/retrieve", RetrieveCriteriaController.handle);

  fastify.patch("/:id", UpdateCriteriaController.handle);

  fastify.delete("/:id", ExcludeCriteriaController.handle);
};

export default criteriaRouter;
