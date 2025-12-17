import { FastifyReply, FastifyRequest } from "fastify";

import { paramsPublicIdSchema } from "../../schemas";
import { GetObjectByPublicIdUseCase } from "../useCases/GetObjectByPublicIdUseCase";

export class GetObjectByPublicIdController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsPublicIdSchema.parse(request.params);

    const object = await GetObjectByPublicIdUseCase.execute(params);

    return reply.send(object);
  }
}
