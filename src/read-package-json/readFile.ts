import fs from 'fs'

// TODO: add test
export const readFile = async (filePath: string): Promise<string> => {
  return await fs.promises.readFile(filePath, 'utf8')
}
