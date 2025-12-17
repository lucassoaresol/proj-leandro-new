import databaseProjLeandroPromise from "../../../db/projLeandro";

interface IInput {
  id: number;
}

type IOutput = void;

export class ExcludeGroupUseCase {
  static async execute({ id }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    await database.deleteFromTable({
      table: "groups",
      where: { id },
    });
  }
}
