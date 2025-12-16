import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";

interface IInput {
  publicId: string;
}

type IOutput = { id: number };

export class GetManagerByPublicIdUseCase {
  static async execute({ publicId }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const manager = await database.findFirst<{ id: number }>({
      table: "managers",
      where: { public_id: publicId },
      select: { id: true },
    });

    if (!manager) {
      throw new AppError("customer not found", 404);
    }

    return manager;
  }
}
