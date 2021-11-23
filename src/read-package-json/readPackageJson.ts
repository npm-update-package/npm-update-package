import fs from 'fs'
import type { Package } from './Package'
import { parsePackageJson } from './parsePackageJson'

// TODO: add test
export const readPackageJson = async (filePath: string): Promise<Package> => {
  const json = await fs.promises.readFile(filePath, 'utf8')
  return parsePackageJson(json)
}
