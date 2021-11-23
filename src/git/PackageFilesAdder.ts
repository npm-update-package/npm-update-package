import type { PackageManager } from '../package-manager'
import type { Git } from './Git'

// TODO: add test
export class PackageFilesAdder {
  private readonly git: Git
  private readonly packageManager: PackageManager

  constructor ({
    git,
    packageManager
  }: {
    git: Git
    packageManager: PackageManager
  }) {
    this.git = git
    this.packageManager = packageManager
  }

  async add (): Promise<void> {
    const packageFiles = this.packageManager.packageFiles
    await this.git.add(...packageFiles)
  }
}
