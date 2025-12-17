import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";

interface IInput {
  publicId: string;
}

type IOutput = { id: number };

export class GetProjectByPublicIdUseCase {
  static async execute({ publicId }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const project = await database.findFirst<{ id: number }>({
      table: "projects",
      where: { public_id: publicId },
      select: { id: true },
    });

    if (!project) {
      throw new AppError("project not found", 404);
    }

    return project;
  }
}
