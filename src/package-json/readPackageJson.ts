import { readFile } from 'node:fs/promises'
import type { PackageMetadata } from './PackageMetadata.js'
import { parsePackageJson } from './parsePackageJson.js'

// TODO: Add test
export const readPackageJson = async (path: string): Promise<PackageMetadata> => {
  const json = await readFile(path, 'utf8')
  return parsePackageJson(json)
}
