import { SemVer } from '../semver'
import type { Terminal } from '../terminal'
import type { PackageManager } from './PackageManager'
import { isVersions } from './Versions'

export class Npm implements PackageManager {
  readonly packageFile = 'package.json'
  readonly lockFile = 'package-lock.json'

  constructor (private readonly terminal: Terminal) {}

  async getVersions (packageName: string): Promise<SemVer[]> {
    const { stdout } = await this.terminal.run('npm', 'info', packageName, 'versions', '--json')
    const versions: unknown = JSON.parse(stdout)

    if (!isVersions(versions)) {
      throw new Error(`Failed to parse versions. versions=${JSON.stringify(versions)}`)
    }

    return versions.map(version => SemVer.of(version))
  }

  /**
   * @see https://docs.npmjs.com/cli/v8/commands/npm-install
   */
  async install (): Promise<void> {
    await this.terminal.run('npm', 'install')
  }
}
