import type { Options } from '../options/Options.js'
import type { Git } from './Git.js'

export class GitConfigInitializer {
  private readonly options: Options
  private readonly git: Git

  constructor ({
    options,
    git
  }: {
    options: Options
    git: Git
  }) {
    this.options = options
    this.git = git
  }

  async initialize (): Promise<void> {
    if (this.options.gitUserName !== undefined) {
      await this.git.setConfig('user.name', this.options.gitUserName)
    }

    if (this.options.gitUserEmail !== undefined) {
      await this.git.setConfig('user.email', this.options.gitUserEmail)
    }
  }
}
