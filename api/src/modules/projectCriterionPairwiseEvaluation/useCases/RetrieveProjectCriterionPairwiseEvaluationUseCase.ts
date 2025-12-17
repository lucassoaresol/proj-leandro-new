import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IWhere } from "../../interfaces";
import {
  IProjectCriterionPairwiseEvaluation,
  IProjectCriterionPairwiseEvaluationRetrieve,
} from "../interfaces";

type IInput = IProjectCriterionPairwiseEvaluationRetrieve;

type IOutput = IProjectCriterionPairwiseEvaluation;

export class RetrieveProjectCriterionPairwiseEvaluationUseCase {
  static async execute({ id, select }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;
    const filters = { id };
    const where: IWhere = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        where[key] = value;
      }
    });

    const projectCriterionPairwiseEvaluation =
      await database.findFirst<IProjectCriterionPairwiseEvaluation>({
        table: "project_criterion_pairwise_evaluations",
        joins: [
          { table: "managers", on: { manager_id: "id" } },
          { table: "criteria", alias: "ca", on: { criterion_a_id: "id" } },
          { table: "criteria", alias: "cb", on: { criterion_b_id: "id" } },
        ],
        where,
        select,
      });

    if (!projectCriterionPairwiseEvaluation) {
      throw new AppError(
        "project criterion pairwise evaluation not found",
        404,
      );
    }

    return projectCriterionPairwiseEvaluation;
  }
}
