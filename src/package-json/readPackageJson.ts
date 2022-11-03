import { readFile } from '../file'
import type { PackageMetadata } from './PackageMetadata'
import { parsePackageJson } from './parsePackageJson'

// TODO: Add test
export const readPackageJson = async (path: string): Promise<PackageMetadata> => {
  const json = await readFile(path)
  return parsePackageJson(json)
}
