import databaseProjLeandroPromise from "../../../db/projLeandro";
import { removeUndefinedValues } from "../../../utils/removeUndefinedValues";
import { IProjectCriterionPairwiseEvaluationDTO } from "../interfaces";

type IInput = IProjectCriterionPairwiseEvaluationDTO;

type IOutput = void;

export class UpdateProjectCriterionPairwiseEvaluationUseCase {
  static async execute({ id, rating }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const dataDict = removeUndefinedValues({
      rating,
    });

    const select = Object.keys(dataDict).reduce<Record<string, boolean>>(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {},
    );

    const projectCriterionPairwiseEvaluation = await database.findFirst<{
      criterion_a_id: number;
      criterion_b_id: number;
      manager_id: number;
    }>({
      table: "project_criterion_pairwise_evaluations",
      where: { id },
      select: {
        ...select,
        criterion_a_id: true,
        criterion_b_id: true,
        manager_id: true,
      },
    });

    if (projectCriterionPairwiseEvaluation) {
      let updatedDataDict: any = {};

      Object.keys(dataDict).forEach((k) => {
        if (k in projectCriterionPairwiseEvaluation) {
          if (
            (dataDict as any)[k] !==
            (projectCriterionPairwiseEvaluation as any)[k]
          ) {
            updatedDataDict[k] = (dataDict as any)[k];
          }
        } else {
          updatedDataDict[k] = (dataDict as any)[k];
        }
      });

      if (Object.keys(updatedDataDict).length) {
        await database.updateIntoTable({
          table: "project_criterion_pairwise_evaluations",
          dataDict: updatedDataDict,
          where: { id },
        });

        const reciprocalEvaluation = await database.findFirst<{ id: number }>({
          table: "project_criterion_pairwise_evaluations",
          where: {
            criterion_a_id: projectCriterionPairwiseEvaluation.criterion_b_id,
            criterion_b_id: projectCriterionPairwiseEvaluation.criterion_a_id,
            manager_id: projectCriterionPairwiseEvaluation.manager_id,
          },
          select: { id: true },
        });

        if (reciprocalEvaluation) {
          await database.updateIntoTable({
            table: "project_criterion_pairwise_evaluations",
            dataDict: { rating: 1 / (dataDict.rating as number) },
            where: { id: reciprocalEvaluation.id },
          });
        }
      }
    }
  }
}
