interface Options {
  pretty?: boolean
}

export const toJSON = (value: unknown, options?: Options): string => {
  const pretty = options?.pretty ?? false

  if (pretty) {
    return JSON.stringify(value, null, 2)
  } else {
    return JSON.stringify(value)
  }
}
