import databaseProjLeandroPromise from "../../../db/projLeandro";
import { IWhere, IOrderBy } from "../../interfaces";
import { IProjectCriteria, IProjectCriteriaList } from "../interfaces";

import { RetrieveProjectCriteriaUseCase } from "./RetrieveProjectCriteriaUseCase";

type IInput = IProjectCriteriaList;

interface IOutput {
  total: number;
  pages: number;
  page: number;
  data: IProjectCriteria[];
}

export class ListProjectCriteriaUseCase {
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
            "m.name": { value, mode: "ilike" },
            "p.name": { value, mode: "ilike" },
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

    const [total, dataProjectCriteria] = await Promise.all([
      database.count({
        table: "project_criteria",
        joins: [
          { table: "criteria", on: { criteria_id: "id" } },
          { table: "projects", on: { project_id: "id" } },
        ],
        where,
      }),
      database.findMany<{ id: number }>({
        table: "project_criteria",
        joins: [
          { table: "criteria", on: { criteria_id: "id" } },
          { table: "projects", on: { project_id: "id" } },
        ],
        where,
        select: { id: true },
        orderBy,
        limit,
        offset,
      }),
    ]);

    const data = await Promise.all(
      dataProjectCriteria.map((projectCriteria) =>
        RetrieveProjectCriteriaUseCase.execute({
          id: projectCriteria.id,
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
