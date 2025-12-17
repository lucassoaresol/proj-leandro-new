import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IProjectCriterionPairwiseEvaluationCreate } from "../interfaces";

type IInput = IProjectCriterionPairwiseEvaluationCreate;

type IOutput = void;

export class CreateProjectCriterionPairwiseEvaluationUseCase {
  static async execute({
    criterion_a_id,
    criterion_b_id,
    manager_id,
    rating,
  }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const existingRelationship = await database.findFirst({
      table: "project_criterion_pairwise_evaluations",
      where: {
        criterion_a_id,
        criterion_b_id,
        manager_id,
      },
    });

    if (existingRelationship) {
      throw new AppError(
        "Project criterion pairwise evaluation relationship already exists",
        409,
      );
    }

    await database.insertIntoTable({
      table: "project_criterion_pairwise_evaluations",
      dataDict: {
        criterion_a_id,
        criterion_b_id,
        manager_id,
        rating,
      },
    });
  }
}
