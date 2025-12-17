import { FastifyPluginAsync } from "fastify";

import managerRouter from "./modules/manager/routes";
import projectRouter from "./modules/project/routes";
import projectManagerRouter from "./modules/projectManager/routes";

const router: FastifyPluginAsync = async (fastify) => {
  fastify.register(managerRouter, { prefix: "/managers" });
  fastify.register(projectRouter, { prefix: "/projects" });
  fastify.register(projectManagerRouter, { prefix: "/project-managers" });
};

export default router;
