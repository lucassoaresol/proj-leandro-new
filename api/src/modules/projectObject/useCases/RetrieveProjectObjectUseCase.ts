import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IWhere } from "../../interfaces";
import { IProjectObject, IProjectObjectRetrieve } from "../interfaces";

type IInput = IProjectObjectRetrieve;

type IOutput = IProjectObject;

export class RetrieveProjectObjectUseCase {
  static async execute({ id, select }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;
    const filters = { id };
    const where: IWhere = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        where[key] = value;
      }
    });

    const projectObject = await database.findFirst<IProjectObject>({
      table: "project_objects",
      joins: [
        { table: "objects", on: { object_id: "id" } },
        { table: "projects", on: { project_id: "id" } },
      ],
      where,
      select,
    });

    if (!projectObject) {
      throw new AppError("project object not found", 404);
    }

    return projectObject;
  }
}
