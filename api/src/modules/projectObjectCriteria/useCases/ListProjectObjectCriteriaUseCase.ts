import databaseProjLeandroPromise from "../../../db/projLeandro";
import { IWhere, IOrderBy } from "../../interfaces";
import {
  IProjectObjectCriteria,
  IProjectObjectCriteriaList,
} from "../interfaces";

import { RetrieveProjectObjectCriteriaUseCase } from "./RetrieveProjectObjectCriteriaUseCase";

type IInput = IProjectObjectCriteriaList;

interface IOutput {
  total: number;
  pages: number;
  page: number;
  data: IProjectObjectCriteria[];
}

export class ListProjectObjectCriteriaUseCase {
  static async execute({
    order,
    select,
    sort,
    search,
    limit = 10,
    page = 1,
  }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;
    const filters = { search };
    const where: IWhere = {};
    const orderBy: IOrderBy = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "search") {
          where["OR"] = {
            "o.name": { value, mode: "ilike" },
            "c.name": { value, mode: "ilike" },
          };
        } else {
          where[key] = value;
        }
      }
    });

    if (sort && order) {
      orderBy[sort] = order;
    }

    const offset = (page - 1) * limit;

    const [total, dataProjectObjectCriteria] = await Promise.all([
      database.count({
        table: "project_object_criteria",
        joins: [
          { table: "project_objects", on: { object_id: "id" } },
          { table: "objects", on: { "po.object_id": "id" } },
          { table: "project_criteria", on: { criteria_id: "id" } },
          { table: "criteria", on: { "pc.criteria_id": "id" } },
        ],
        where,
      }),
      database.findMany<{ id: number }>({
        table: "project_object_criteria",
        joins: [
          { table: "project_objects", on: { object_id: "id" } },
          { table: "objects", on: { "po.object_id": "id" } },
          { table: "project_criteria", on: { criteria_id: "id" } },
          { table: "criteria", on: { "pc.criteria_id": "id" } },
        ],
        where,
        select: { id: true },
        orderBy,
        limit,
        offset,
      }),
    ]);

    const data = await Promise.all(
      dataProjectObjectCriteria.map((projectObjectCriteria) =>
        RetrieveProjectObjectCriteriaUseCase.execute({
          id: projectObjectCriteria.id,
          select,
        }),
      ),
    );

    const pages = Math.ceil(total / limit);

    return {
      total,
      pages,
      page,
      data,
    };
  }
}
