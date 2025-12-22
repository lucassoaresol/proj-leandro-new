import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IProjectObjectCriteriaCreate } from "../interfaces";

type IInput = IProjectObjectCriteriaCreate;

type IOutput = void;

export class CreateProjectObjectCriteriaUseCase {
  static async execute({
    criteria_id,
    object_id,
    value,
  }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const existingRelationship = await database.findFirst({
      table: "project_object_criteria",
      where: {
        criteria_id,
        object_id,
      },
    });

    if (existingRelationship) {
      throw new AppError(
        "Project object criteria relationship already exists",
        409,
      );
    }

    await database.insertIntoTable({
      table: "project_object_criteria",
      dataDict: {
        criteria_id,
        object_id,
        value,
      },
    });
  }
}
