import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IProjectManagerCreate } from "../interfaces";

type IInput = IProjectManagerCreate;

type IOutput = void;

export class CreateProjectManagerUseCase {
  static async execute({
    project_id,
    manager_id,
    importance_weight,
  }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const existingRelationship = await database.findFirst({
      table: "project_managers",
      where: {
        project_id,
        manager_id,
      },
    });

    if (existingRelationship) {
      throw new AppError("Project manager relationship already exists", 409);
    }

    await database.insertIntoTable({
      table: "project_managers",
      dataDict: {
        project_id,
        manager_id,
        importance_weight,
      },
    });
  }
}
