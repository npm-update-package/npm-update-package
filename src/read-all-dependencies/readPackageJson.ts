import type { Package } from './Package'
import { parsePackageJson } from './parsePackageJson'
import { readFile } from './readFile'

// TODO: add test
export const readPackageJson = async (filePath: string): Promise<Package> => {
  const json = await readFile(filePath)
  return parsePackageJson(json)
}
