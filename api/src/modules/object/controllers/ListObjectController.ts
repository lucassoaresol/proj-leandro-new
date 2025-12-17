import { FastifyReply, FastifyRequest } from "fastify";

import { listObjectSchema } from "../schemas";
import { ListObjectUseCase } from "../useCases/ListObjectUseCase";

export class ListObjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const validatedQuery = listObjectSchema.parse(request.query);

    const objects = await ListObjectUseCase.execute(validatedQuery);

    return reply.send(objects);
  }
}
