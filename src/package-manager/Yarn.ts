import type { Terminal } from '../terminal'
import type { PackageManager } from './PackageManager'

// TODO: add test
export class Yarn implements PackageManager {
  readonly packageFiles = [
    'package.json',
    'yarn.lock'
  ]

  readonly packageFile = 'package.json'

  constructor (private readonly terminal: Terminal) {}

  /**
   * @see https://classic.yarnpkg.com/en/docs/cli/install
   */
  async install (): Promise<void> {
    await this.terminal.run('yarn', 'install')
  }
}
