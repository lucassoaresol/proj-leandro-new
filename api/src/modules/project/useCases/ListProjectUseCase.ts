import databaseProjLeandroPromise from "../../../db/projLeandro";
import { IOrderBy, IWhere } from "../../interfaces";
import { IProject, IProjectList } from "../interfaces";

import { RetrieveProjectUseCase } from "./RetrieveProjectUseCase";

type IInput = IProjectList;

interface IOutput {
  total: number;
  pages: number;
  page: number;
  data: IProject[];
}

export class ListProjectUseCase {
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
            name: { value, mode: "ilike" },
            description: { value, mode: "ilike" },
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

    const [total, dataProject] = await Promise.all([
      database.count({
        table: "projects",
        where,
      }),
      database.findMany<{ id: number }>({
        table: "projects",
        where,
        select: { id: true },
        orderBy,
        limit,
        offset,
      }),
    ]);

    const data = await Promise.all(
      dataProject.map((project) =>
        RetrieveProjectUseCase.execute({ id: project.id, select }),
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
