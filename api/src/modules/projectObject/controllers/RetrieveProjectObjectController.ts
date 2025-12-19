import { FastifyReply, FastifyRequest } from "fastify";

import { retrieveProjectObjectSchema } from "../schemas";
import { RetrieveProjectObjectUseCase } from "../useCases/RetrieveProjectObjectUseCase";

export class RetrieveProjectObjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = retrieveProjectObjectSchema.parse(request.query);

    const result = await RetrieveProjectObjectUseCase.execute(parsed);

    return reply.send(result);
  }
}
