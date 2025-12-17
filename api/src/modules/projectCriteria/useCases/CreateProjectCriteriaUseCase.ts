import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IProjectCriteriaCreate } from "../interfaces";

type IInput = IProjectCriteriaCreate;

type IOutput = void;

export class CreateProjectCriteriaUseCase {
  static async execute({
    criteria_id,
    optimization_goal,
    project_id,
  }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const existingRelationship = await database.findFirst({
      table: "project_criteria",
      where: {
        project_id,
        criteria_id,
      },
    });

    if (existingRelationship) {
      throw new AppError("Project criteria relationship already exists", 409);
    }

    await database.insertIntoTable({
      table: "project_criteria",
      dataDict: {
        project_id,
        criteria_id,
        optimization_goal,
      },
    });
  }
}
