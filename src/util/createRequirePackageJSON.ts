import { createRequire } from 'node:module'
import { isPackageMetadata } from '../package-json/PackageMetadata.js'
import type { PackageMetadata } from '../package-json/PackageMetadata.js'

type Path = Parameters<typeof createRequire>[0]
type ID = Parameters<ReturnType<typeof createRequire>>[0]

/**
 * @example
 * ```ts
 * const requirePackageJSON = createRequirePackageJSON(import.meta.url)
 * const pkg = requirePackageJSON('path/to/package.json')
 * ```
 */
export const createRequirePackageJSON = (path: Path): (id: ID) => PackageMetadata => {
  const require = createRequire(path)
  return (id) => {
    const maybePackageMetadata = require(id)

    if (isPackageMetadata(maybePackageMetadata)) {
      return maybePackageMetadata
    } else {
      throw new Error(`Failed to parse package.json. path=${path.toString()}, id=${id}`)
    }
  }
}
