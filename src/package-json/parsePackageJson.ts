import type { PackageMetadata } from './PackageMetadata.js'
import { isPackageMetadata } from './PackageMetadata.js'

export const parsePackageJson = (json: string): PackageMetadata => {
  const parsed: unknown = JSON.parse(json)

  if (isPackageMetadata(parsed)) {
    return parsed
  } else {
    throw new Error(`Failed to parse package.json. json=${json}`)
  }
}
