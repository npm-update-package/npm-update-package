import type { Terminal } from '../Terminal'
import type { PackageManager } from './PackageManager'

// TODO: add logs using logger
export class Npm implements PackageManager {
  constructor (private readonly terminal: Terminal) {}

  /**
   * @see https://docs.npmjs.com/cli/v8/commands/npm-install
   */
  async install (): Promise<void> {
    await this.terminal.run('npm', 'install')
  }
}
