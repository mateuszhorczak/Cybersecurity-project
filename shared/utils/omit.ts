export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  omittedKeys: K[],
): Omit<T, K> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !omittedKeys.includes(key as K)),
  ) as Omit<T, K>
}
