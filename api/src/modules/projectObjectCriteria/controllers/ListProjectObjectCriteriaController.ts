import { FastifyReply, FastifyRequest } from "fastify";

import { listProjectObjectCriteriaSchema } from "../schemas";
import { ListProjectObjectCriteriaUseCase } from "../useCases/ListProjectObjectCriteriaUseCase";

export class ListProjectObjectCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = listProjectObjectCriteriaSchema.parse(request.query);

    const result = await ListProjectObjectCriteriaUseCase.execute(parsed);

    return reply.send(result);
  }
}
