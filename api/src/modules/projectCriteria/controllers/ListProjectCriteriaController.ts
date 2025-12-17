import { FastifyReply, FastifyRequest } from "fastify";

import { listProjectCriteriaSchema } from "../schemas";
import { ListProjectCriteriaUseCase } from "../useCases/ListProjectCriteriaUseCase";

export class ListProjectCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = listProjectCriteriaSchema.parse(request.query);

    const result = await ListProjectCriteriaUseCase.execute(parsed);

    return reply.send(result);
  }
}
