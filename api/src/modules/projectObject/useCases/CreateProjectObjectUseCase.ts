import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IProjectObjectCreate } from "../interfaces";

type IInput = IProjectObjectCreate;

type IOutput = void;

export class CreateProjectObjectUseCase {
  static async execute({ object_id, project_id }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const existingRelationship = await database.findFirst({
      table: "project_objects",
      where: {
        object_id,
        project_id,
      },
    });

    if (existingRelationship) {
      throw new AppError("Project object relationship already exists", 409);
    }

    await database.insertIntoTable({
      table: "project_objects",
      dataDict: {
        project_id,
        object_id,
      },
    });
  }
}
