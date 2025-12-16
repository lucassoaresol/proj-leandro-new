export function getColumnForSorting(
  defaultColumns: string[],
  value?: string,
  isSort?: boolean,
): string {
  const matchingColumns = defaultColumns.filter((col) => {
    if (value) {
      const colSplit = col.split(value);
      return colSplit.length > 1;
    }
    return false;
  });

  if (matchingColumns.length > 0) {
    const matchedColumn = matchingColumns[0];
    if (isSort) {
      const [column] = matchedColumn.split(" AS ");
      return column;
    }
    return matchedColumn;
  }

  return value || "";
}
