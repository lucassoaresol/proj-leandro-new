import { FastifyReply, FastifyRequest } from "fastify";

import { calculateProjectCriterionCRSchema } from "../schemas";
import { CalculateProjectCriterionCRUseCase } from "../useCases/CalculateProjectCriterionCRUseCase";

export class CalculateProjectCriterionCRController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = calculateProjectCriterionCRSchema.parse(request.body);

    const result = await CalculateProjectCriterionCRUseCase.execute(parsed);

    return reply.send(result);
  }
}
