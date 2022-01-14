import fs from 'fs'
import type { Logger } from '../logger'
import type { PackageJsonParser } from './PackageJsonParser'
import type { PackageMetadata } from './PackageMetadata'

// TODO: add test
export class PackageJsonReader {
  private readonly packageJsonParser: PackageJsonParser
  private readonly logger: Logger

  constructor ({
    packageJsonParser,
    logger
  }: {
    packageJsonParser: PackageJsonParser
    logger: Logger
  }) {
    this.packageJsonParser = packageJsonParser
    this.logger = logger
  }

  async read (): Promise<PackageMetadata> {
    const json = await fs.promises.readFile('./package.json', 'utf8')
    this.logger.debug(`json=${json}`)
    return this.packageJsonParser.parse(json)
  }
}
