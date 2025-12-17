import { FastifyReply, FastifyRequest } from "fastify";

import { listProjectManagerSchema } from "../schemas";
import { ListProjectManagerUseCase } from "../useCases/ListProjectManagerUseCase";

export class ListProjectManagerController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = listProjectManagerSchema.parse(request.query);

    const result = await ListProjectManagerUseCase.execute(parsed);

    return reply.send(result);
  }
}
