import databaseProjLeandroPromise from "../../../db/projLeandro";

type IInput = {
  id: number;
};

type IOutput = void;

export class ExcludeProjectCriteriaUseCase {
  static async execute({ id }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    await database.deleteFromTable({
      table: "project_criteria",
      where: {
        id,
      },
    });
  }
}
