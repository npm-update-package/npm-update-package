import { createRequire } from 'node:module'
import { isPackageMetadata } from '../package-json/PackageMetadata.js'
import type { PackageMetadata } from '../package-json/PackageMetadata.js'

type Path = Parameters<typeof createRequire>[0]
type ID = Parameters<ReturnType<typeof createRequire>>[0]

/**
 * @example
 * ```typescript
 * const requirePackageJSON = createRequirePackageJSON(import.meta.url)
 * const packageJSON = requirePackageJSON('path/to/package.json')
 * ```
 */
export const createRequirePackageJSON = (path: Path): (id: ID) => PackageMetadata => {
  const require = createRequire(path)
  return (id) => {
    const packageJSON = require(id)

    if (isPackageMetadata(packageJSON)) {
      return packageJSON
    } else {
      throw new Error(`Invalid package.json. path=${path.toString()}, id=${id}`)
    }
  }
}
