/* eslint-disable @typescript-eslint/no-unused-vars */
export function removeUndefinedValues(data: any) {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined),
  );
}
