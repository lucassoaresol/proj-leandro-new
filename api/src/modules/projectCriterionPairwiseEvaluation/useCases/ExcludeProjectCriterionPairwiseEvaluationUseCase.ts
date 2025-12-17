import databaseProjLeandroPromise from "../../../db/projLeandro";

type IInput = {
  id: number;
};

type IOutput = void;

export class ExcludeProjectCriterionPairwiseEvaluationUseCase {
  static async execute({ id }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    await database.deleteFromTable({
      table: "project_criterion_pairwise_evaluations",
      where: {
        id,
      },
    });
  }
}
