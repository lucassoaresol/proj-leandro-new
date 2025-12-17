import { FastifyReply, FastifyRequest } from "fastify";

import { retrieveCriteriaSchema } from "../schemas";
import { RetrieveCriteriaUseCase } from "../useCases/RetrieveCriteriaUseCase";

export class RetrieveCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const validatedQuery = retrieveCriteriaSchema.parse(request.query);

    const criteria = await RetrieveCriteriaUseCase.execute(validatedQuery);

    return reply.send(criteria);
  }
}
