import { FastifyReply, FastifyRequest } from "fastify";

import { paramsPublicIdSchema } from "../../schemas";
import { GetGroupByPublicIdUseCase } from "../useCases/GetGroupByPublicIdUseCase";

export class GetGroupByPublicIdController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsPublicIdSchema.parse(request.params);

    const group = await GetGroupByPublicIdUseCase.execute(params);

    return reply.send(group);
  }
}
