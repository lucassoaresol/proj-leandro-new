import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IWhere } from "../../interfaces";
import { IProjectManager, IProjectManagerRetrieve } from "../interfaces";

type IInput = IProjectManagerRetrieve;

type IOutput = IProjectManager;

export class RetrieveProjectManagerUseCase {
  static async execute({ id, select }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;
    const filters = { id };
    const where: IWhere = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        where[key] = value;
      }
    });

    const projectManager = await database.findFirst<IProjectManager>({
      table: "project_managers",
      joins: [
        { table: "managers", on: { manager_id: "id" } },
        { table: "projects", on: { project_id: "id" } },
      ],
      where,
      select,
    });

    if (!projectManager) {
      throw new AppError("project manager not found", 404);
    }

    return projectManager;
  }
}
