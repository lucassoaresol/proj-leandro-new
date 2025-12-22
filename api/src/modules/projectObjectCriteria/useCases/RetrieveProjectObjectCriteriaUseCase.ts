import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IWhere } from "../../interfaces";
import {
  IProjectObjectCriteria,
  IProjectObjectCriteriaRetrieve,
} from "../interfaces";

type IInput = IProjectObjectCriteriaRetrieve;

type IOutput = IProjectObjectCriteria;

export class RetrieveProjectObjectCriteriaUseCase {
  static async execute({ id, select }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;
    const filters = { id };
    const where: IWhere = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        where[key] = value;
      }
    });

    const projectObjectCriteria =
      await database.findFirst<IProjectObjectCriteria>({
        table: "project_object_criteria",
        joins: [
          { table: "project_objects", on: { object_id: "id" } },
          { table: "objects", on: { "po.object_id": "id" } },
          { table: "project_criteria", on: { criteria_id: "id" } },
          { table: "criteria", on: { "pc.criteria_id": "id" } },
        ],
        where,
        select,
      });

    if (!projectObjectCriteria) {
      throw new AppError("project object criteria not found", 404);
    }

    return projectObjectCriteria;
  }
}
