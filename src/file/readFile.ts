import fs from 'fs'

export type Path = Parameters<typeof fs.promises.readFile>[0]

// TODO: add test
export const readFile = async (path: Path): Promise<string> => {
  const data = await fs.promises.readFile(path, 'utf8')
  return data
}
