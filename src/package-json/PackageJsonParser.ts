import type { Logger } from '../logger'
import {
  isPackageMetadata,
  type PackageMetadata
} from './PackageMetadata'

// TODO: add test
export class PackageJsonParser {
  constructor (private readonly logger: Logger) {}

  parse (json: string): PackageMetadata {
    const parsed: unknown = JSON.parse(json)
    this.logger.debug(`parsed=${JSON.stringify(parsed)}`)

    if (isPackageMetadata(parsed)) {
      return parsed
    } else {
      throw new Error(`Failed to parse package.json. json=${json}`)
    }
  }
}
