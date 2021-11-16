import type { Terminal } from '../Terminal'
import type { PackageManager } from './PackageManager'

export class Yarn implements PackageManager {
  constructor (private readonly terminal: Terminal) {}

  /**
   * @see https://classic.yarnpkg.com/en/docs/cli/install
   */
  async install (): Promise<void> {
    await this.terminal.run('yarn', 'install')
  }
}
