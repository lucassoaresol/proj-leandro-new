import { FastifyReply, FastifyRequest } from "fastify";

import { retrieveProjectCriteriaSchema } from "../schemas";
import { RetrieveProjectCriteriaUseCase } from "../useCases/RetrieveProjectCriteriaUseCase";

export class RetrieveProjectCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = retrieveProjectCriteriaSchema.parse(request.query);

    const result = await RetrieveProjectCriteriaUseCase.execute(parsed);

    return reply.send(result);
  }
}
