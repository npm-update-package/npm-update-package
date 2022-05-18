interface Options {
  pretty?: boolean
}

export const toJSON = (value: unknown, options?: Options): string => {
  const pretty = options?.pretty ?? false
  return pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value)
}
