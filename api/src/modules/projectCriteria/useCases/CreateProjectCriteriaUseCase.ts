import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { CreateProjectCriterionPairwiseEvaluationUseCase } from "../../projectCriterionPairwiseEvaluation/useCases/CreateProjectCriterionPairwiseEvaluationUseCase";
import { IProjectCriteriaCreate } from "../interfaces";

type IInput = IProjectCriteriaCreate;

type IOutput = void;

export class CreateProjectCriteriaUseCase {
  static async execute({
    criteria_id,
    optimization_goal,
    project_id,
  }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const existingRelationship = await database.findFirst({
      table: "project_criteria",
      where: {
        project_id,
        criteria_id,
      },
    });

    if (existingRelationship) {
      throw new AppError("Project criteria relationship already exists", 409);
    }

    const insertedRecord = await database.insertIntoTable<{ id: number }>({
      table: "project_criteria",
      dataDict: {
        project_id,
        criteria_id,
        optimization_goal,
      },
      select: { id: true },
    });

    if (insertedRecord) {
      const projectManagers = await database.findMany<{ id: number }>({
        table: "project_managers",
        where: { project_id },
        select: { id: true },
      });

      await Promise.all(
        projectManagers.map((manager) =>
          CreateProjectCriterionPairwiseEvaluationUseCase.execute({
            criterion_a_id: insertedRecord.id,
            criterion_b_id: insertedRecord.id,
            manager_id: manager.id,
            rating: 1,
          }),
        ),
      );
    }
  }
}
