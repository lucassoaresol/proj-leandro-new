import { FastifyReply, FastifyRequest } from "fastify";

import { retrieveProjectObjectCriteriaSchema } from "../schemas";
import { RetrieveProjectObjectCriteriaUseCase } from "../useCases/RetrieveProjectObjectCriteriaUseCase";

export class RetrieveProjectObjectCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = retrieveProjectObjectCriteriaSchema.parse(request.query);

    const result = await RetrieveProjectObjectCriteriaUseCase.execute(parsed);

    return reply.send(result);
  }
}
