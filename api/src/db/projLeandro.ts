import { Database } from "pg-utils";

import getDatabase from "./database";

const databaseProjLeandroPromise: Promise<Database> = (async () => {
  return await getDatabase("proj-leandro");
})();

export default databaseProjLeandroPromise;
