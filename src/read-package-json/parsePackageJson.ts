import { isPackage } from './Package'
import type { Package } from './Package'

// TODO: add test
export const parsePackageJson = (json: string): Package => {
  const parsed: unknown = JSON.parse(json)

  if (isPackage(parsed)) {
    return parsed
  } else {
    throw new Error(`Failed to parse package.json. json=${json}`)
  }
}
