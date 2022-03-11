import type { Terminal } from '../terminal'
import type { PackageManager } from './PackageManager'

export class Yarn implements PackageManager {
  readonly packageFile = 'package.json'
  readonly lockFile = 'yarn.lock'

  constructor (private readonly terminal: Terminal) {}

  // TODO: getVersions

  /**
   * @see https://classic.yarnpkg.com/en/docs/cli/install
   */
  async install (): Promise<void> {
    await this.terminal.run('yarn', 'install')
  }
}
