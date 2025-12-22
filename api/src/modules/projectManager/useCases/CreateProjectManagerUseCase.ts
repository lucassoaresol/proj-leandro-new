import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { CreateProjectCriterionPairwiseEvaluationUseCase } from "../../projectCriterionPairwiseEvaluation/useCases/CreateProjectCriterionPairwiseEvaluationUseCase";
import { IProjectManagerCreate } from "../interfaces";

type IInput = IProjectManagerCreate;

type IOutput = void;

export class CreateProjectManagerUseCase {
  static async execute({
    project_id,
    manager_id,
    importance_weight,
  }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const existingRelationship = await database.findFirst({
      table: "project_managers",
      where: {
        project_id,
        manager_id,
      },
    });

    if (existingRelationship) {
      throw new AppError("Project manager relationship already exists", 409);
    }

    const insertedRecord = await database.insertIntoTable<{ id: number }>({
      table: "project_managers",
      dataDict: {
        project_id,
        manager_id,
        importance_weight,
      },
      select: { id: true },
    });

    if (insertedRecord) {
      const projectCriteria = await database.findMany<{ id: number }>({
        table: "project_criteria",
        where: { project_id },
        select: { id: true },
      });

      await Promise.all(
        projectCriteria.map((criterion) =>
          CreateProjectCriterionPairwiseEvaluationUseCase.execute({
            criterion_a_id: criterion.id,
            criterion_b_id: criterion.id,
            manager_id: insertedRecord.id,
            rating: 1,
          }),
        ),
      );
    }
  }
}
