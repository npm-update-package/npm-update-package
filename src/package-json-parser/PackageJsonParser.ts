import type { Logger } from '../logger'
import { isPackage } from '../types'
import type { Package } from '../types'

// TODO: add test
export class PackageJsonParser {
  constructor (private readonly logger: Logger) {}

  parse (json: string): Package {
    const parsed: unknown = JSON.parse(json)
    this.logger.debug(`parsed=${JSON.stringify(parsed)}`)

    if (isPackage(parsed)) {
      return parsed
    } else {
      throw new Error(`Failed to parse package.json. json=${json}`)
    }
  }
}
