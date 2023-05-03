import fs from 'node:fs'

export const readFile = async (path: string): Promise<string> => {
  return await fs.promises.readFile(path, 'utf8')
}
