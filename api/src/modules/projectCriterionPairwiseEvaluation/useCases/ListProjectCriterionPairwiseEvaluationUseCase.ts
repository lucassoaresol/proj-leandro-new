import databaseProjLeandroPromise from "../../../db/projLeandro";
import { IWhere, IOrderBy } from "../../interfaces";
import {
  IProjectCriterionPairwiseEvaluation,
  IProjectCriterionPairwiseEvaluationList,
} from "../interfaces";

import { RetrieveProjectCriterionPairwiseEvaluationUseCase } from "./RetrieveProjectCriterionPairwiseEvaluationUseCase";

type IInput = IProjectCriterionPairwiseEvaluationList;

interface IOutput {
  total: number;
  pages: number;
  page: number;
  data: IProjectCriterionPairwiseEvaluation[];
}

export class ListProjectCriterionPairwiseEvaluationUseCase {
  static async execute({
    manager_id,
    project_id,
    order,
    select,
    sort,
    search,
    limit = 10,
    page = 1,
  }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;
    const filters = { search, manager_id, project_id };
    const where: IWhere = {};
    const orderBy: IOrderBy = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "search") {
          where["OR"] = {
            "m.name": { value, mode: "ilike" },
            "ca.name": { value, mode: "ilike" },
            "cb.name": { value, mode: "ilike" },
          };
        } else if (key === "project_id") {
          where["m.project_id"] = value;
        } else {
          where[key] = value;
        }
      }
    });

    if (sort && order) {
      orderBy[sort] = order;
    }

    const offset = (page - 1) * limit;

    const [total, dataProjectCriterionPairwiseEvaluations] = await Promise.all([
      database.count({
        table: "project_criterion_pairwise_evaluations",
        joins: [
          { table: "managers", on: { manager_id: "id" } },
          { table: "criteria", alias: "ca", on: { criterion_a_id: "id" } },
          { table: "criteria", alias: "cb", on: { criterion_b_id: "id" } },
        ],
        where,
      }),
      database.findMany<{ id: number }>({
        table: "project_criterion_pairwise_evaluations",
        joins: [
          { table: "managers", on: { manager_id: "id" } },
          { table: "criteria", alias: "ca", on: { criterion_a_id: "id" } },
          { table: "criteria", alias: "cb", on: { criterion_b_id: "id" } },
        ],
        where,
        select: { id: true },
        orderBy,
        limit,
        offset,
      }),
    ]);

    const data = await Promise.all(
      dataProjectCriterionPairwiseEvaluations.map(
        (projectCriterionPairwiseEvaluation) =>
          RetrieveProjectCriterionPairwiseEvaluationUseCase.execute({
            id: projectCriterionPairwiseEvaluation.id,
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
