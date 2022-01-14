import fs from 'fs'

// TODO: add test
export const readFile = async (path: string): Promise<string> => {
  return await fs.promises.readFile(path, 'utf8')
}
