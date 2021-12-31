import { readFile } from '../file'
import type { Package } from './Package'
import type { PackageJsonParser } from './PackageJsonParser'

// TODO: add test
export class PackageJsonReader {
  constructor (private readonly packageJsonParser: PackageJsonParser) {}

  async read (): Promise<Package> {
    const json = await readFile('./package.json')
    return this.packageJsonParser.parse(json)
  }
}
