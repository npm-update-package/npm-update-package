import fs from 'fs'
import type { Logger } from '../logger'
import type { Package } from './Package'
import { parsePackageJson } from './parsePackageJson'

// TODO: add test
export class PackageJsonReader {
  constructor (private readonly logger: Logger) {}

  async read (filePath: string): Promise<Package> {
    const json = await fs.promises.readFile(filePath, 'utf8')
    this.logger.debug(`json=${json}`)
    return parsePackageJson(json)
  }
}
