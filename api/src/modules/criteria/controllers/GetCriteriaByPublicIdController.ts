import { FastifyReply, FastifyRequest } from "fastify";

import { paramsPublicIdSchema } from "../../schemas";
import { GetCriteriaByPublicIdUseCase } from "../useCases/GetCriteriaByPublicIdUseCase";

export class GetCriteriaByPublicIdController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsPublicIdSchema.parse(request.params);

    const criteria = await GetCriteriaByPublicIdUseCase.execute(params);

    return reply.send(criteria);
  }
}
