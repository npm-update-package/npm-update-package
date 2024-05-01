import { readFile } from '../file/readFile.js'
import type { PackageMetadata } from './PackageMetadata.js'
import { parsePackageJson } from './parsePackageJson.js'

// TODO: Add test
export const readPackageJson = async (path: string): Promise<PackageMetadata> => {
  const json = await readFile(path)
  return parsePackageJson(json)
}
