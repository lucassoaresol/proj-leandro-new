import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IWhere } from "../../interfaces";
import { IProjectCriteria, IProjectCriteriaRetrieve } from "../interfaces";

type IInput = IProjectCriteriaRetrieve;

type IOutput = IProjectCriteria;

export class RetrieveProjectCriteriaUseCase {
  static async execute({ id, select }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;
    const filters = { id };
    const where: IWhere = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        where[key] = value;
      }
    });

    const projectCriteria = await database.findFirst<IProjectCriteria>({
      table: "project_criteria",
      joins: [
        { table: "criteria", on: { criteria_id: "id" } },
        { table: "projects", on: { project_id: "id" } },
      ],
      where,
      select,
    });

    if (!projectCriteria) {
      throw new AppError("project criteria not found", 404);
    }

    return projectCriteria;
  }
}
