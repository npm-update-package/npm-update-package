import type { Terminal } from '../../terminal/Terminal.js'
import type { PackageManager } from '../PackageManager.js'
import { isNpmVersions } from './NpmVersions.js'

export class Npm implements PackageManager {
  readonly packageFile = 'package.json'
  readonly lockFile = 'package-lock.json'

  constructor (private readonly terminal: Terminal) {}

  /**
   * @see https://docs.npmjs.com/cli/v8/commands/npm-view
   */
  async getVersions (packageName: string): Promise<string[]> {
    const stdout = await this.terminal.run('npm', 'info', packageName, 'versions', '--json')
    const versions: unknown = JSON.parse(stdout)

    if (!isNpmVersions(versions)) {
      throw new Error(`Failed to parse versions. versions=${JSON.stringify(versions)}`)
    }

    return versions
  }

  /**
   * @see https://docs.npmjs.com/cli/v8/commands/npm-install
   */
  async install (): Promise<void> {
    await this.terminal.run('npm', 'install')
  }
}
