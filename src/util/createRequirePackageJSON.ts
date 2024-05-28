import { createRequire } from 'node:module'
import {
  type PackageMetadata,
  isPackageMetadata
} from '../package-json/PackageMetadata.js'

/**
 * @example
 * ```typescript
 * const requirePackageJSON = createRequirePackageJSON(import.meta.url)
 * const packageJSON = requirePackageJSON('path/to/package.json')
 * ```
 */
export const createRequirePackageJSON = (path: string | URL): (id: string) => PackageMetadata => {
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
