import { FastifyReply, FastifyRequest } from "fastify";

import { retrieveGroupSchema } from "../schemas";
import { RetrieveGroupUseCase } from "../useCases/RetrieveGroupUseCase";

export class RetrieveGroupController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const validatedQuery = retrieveGroupSchema.parse(request.query);

    const group = await RetrieveGroupUseCase.execute(validatedQuery);

    return reply.send(group);
  }
}
