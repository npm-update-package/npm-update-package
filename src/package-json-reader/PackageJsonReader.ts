import fs from 'fs'
import type { Logger } from '../logger'
import type { PackageJsonParser } from '../package-json-parser'
import type { Package } from './Package'

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

  async read (filePath: string): Promise<Package> {
    const json = await fs.promises.readFile(filePath, 'utf8')
    this.logger.debug(`json=${json}`)
    return this.packageJsonParser.parse(json)
  }
}
