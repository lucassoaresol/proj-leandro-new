import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IWhere } from "../../interfaces";
import { IProject, IProjectRetrieve } from "../interfaces";

type IInput = IProjectRetrieve;

type IOutput = IProject;

export class RetrieveProjectUseCase {
  static async execute({ id, select }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;
    const filters = { id };
    const where: IWhere = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        where[key] = value;
      }
    });

    const project = await database.findFirst<IProject>({
      table: "projects",
      where,
      select,
    });

    if (!project) {
      throw new AppError("project not found", 404);
    }

    return project;
  }
}
