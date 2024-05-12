import type { Terminal } from '../../terminal/Terminal.js'
import type { PackageManager } from '../PackageManager.js'
import { isYarnVersions } from './YarnVersions.js'

export class Yarn implements PackageManager {
  readonly packageFile = 'package.json'
  readonly lockFile = 'yarn.lock'

  constructor (private readonly terminal: Terminal) {}

  /**
   * @see https://classic.yarnpkg.com/en/docs/cli/info
   */
  async getVersions (packageName: string): Promise<string[]> {
    const stdout = await this.terminal.run('yarn', 'info', packageName, 'versions', '--json')
    const versions: unknown = JSON.parse(stdout)

    if (!isYarnVersions(versions)) {
      throw new Error(`Failed to parse versions. versions=${JSON.stringify(versions)}`)
    }

    return versions.data
  }

  /**
   * @see https://classic.yarnpkg.com/en/docs/cli/install
   */
  async install (): Promise<void> {
    await this.terminal.run('yarn', 'install')
  }
}
