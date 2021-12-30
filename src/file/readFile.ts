import { readFile as readFileAsync } from 'fs/promises'

export type Path = Parameters<typeof readFileAsync>[0]

// TODO: add test
export const readFile = async (path: Path): Promise<string> => {
  const data = await readFileAsync(path, 'utf8')
  return data
}
