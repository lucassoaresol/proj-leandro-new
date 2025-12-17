import { FastifyPluginAsync } from "fastify";

import managerRouter from "./modules/manager/routes";
import projectRouter from "./modules/project/routes";

const router: FastifyPluginAsync = async (fastify) => {
  fastify.register(managerRouter, { prefix: "/managers" });
  fastify.register(projectRouter, { prefix: "/projects" });
};

export default router;
