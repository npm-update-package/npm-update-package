import type { Terminal } from '../terminal'
import type { PackageManager } from './PackageManager'
import { isVersions } from './Versions'

export class Yarn implements PackageManager {
  readonly packageFile = 'package.json'
  readonly lockFile = 'yarn.lock'

  constructor (private readonly terminal: Terminal) {}

  async getVersions (packageName: string): Promise<string[]> {
    const { stdout } = await this.terminal.run('yarn', 'info', packageName, 'versions', '--json')
    const versions: unknown = JSON.parse(stdout)

    if (!isVersions(versions)) {
      throw new Error(`Failed to parse versions. versions=${JSON.stringify(versions)}`)
    }

    return versions
  }

  /**
   * @see https://classic.yarnpkg.com/en/docs/cli/install
   */
  async install (): Promise<void> {
    await this.terminal.run('yarn', 'install')
  }
}
