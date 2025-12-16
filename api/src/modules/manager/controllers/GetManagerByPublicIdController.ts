import { FastifyReply, FastifyRequest } from "fastify";

import { paramsPublicIdSchema } from "../../schemas";
import { GetManagerByPublicIdUseCase } from "../useCases/GetManagerByPublicIdUseCase";

export class GetManagerByPublicIdController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsPublicIdSchema.parse(request.params);

    const manager = await GetManagerByPublicIdUseCase.execute(params);

    return reply.send(manager);
  }
}
