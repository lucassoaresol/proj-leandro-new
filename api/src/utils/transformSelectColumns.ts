import { getColumnForSorting } from "./getColumnForSorting";

export function transformSelectColumns(
  defaultColumns: string[],
  value?: string,
): Record<string, boolean> {
  if (!value) {
    return Object.fromEntries(defaultColumns.map((col) => [col, true]));
  }

  return value.split(",").reduce<Record<string, boolean>>((acc, col) => {
    const colName = col.trim();
    const column = getColumnForSorting(defaultColumns, colName);
    acc[column] = true;
    return acc;
  }, {});
}
