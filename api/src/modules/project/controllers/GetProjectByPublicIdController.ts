import { FastifyReply, FastifyRequest } from "fastify";

import { paramsPublicIdSchema } from "../../schemas";
import { GetProjectByPublicIdUseCase } from "../useCases/GetProjectByPublicIdUseCase";

export class GetProjectByPublicIdController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsPublicIdSchema.parse(request.params);

    const data = await GetProjectByPublicIdUseCase.execute(params);

    return reply.send(data);
  }
}
