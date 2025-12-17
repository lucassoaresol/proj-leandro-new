import { FastifyReply, FastifyRequest } from "fastify";

import { listCriteriaSchema } from "../schemas";
import { ListCriteriaUseCase } from "../useCases/ListCriteriaUseCase";

export class ListCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const validatedQuery = listCriteriaSchema.parse(request.query);

    const criteria = await ListCriteriaUseCase.execute(validatedQuery);

    return reply.send(criteria);
  }
}
