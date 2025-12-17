import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";

interface IInput {
  publicId: string;
}

type IOutput = { id: number };

export class GetObjectByPublicIdUseCase {
  static async execute({ publicId }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const object = await database.findFirst<{ id: number }>({
      table: "objects",
      where: { public_id: publicId },
      select: { id: true },
    });

    if (!object) {
      throw new AppError("object not found", 404);
    }

    return object;
  }
}
