import { FastifyPluginAsync } from "fastify";

import managerRouter from "./modules/manager/routes";

const router: FastifyPluginAsync = async (fastify) => {
  fastify.register(managerRouter, { prefix: "/managers" });
};

export default router;
