import type { Git } from './Git'

// TODO: add test
export class Committer {
  constructor (private readonly git: Git) {}

  async commit (message: string): Promise<void> {
    // TODO replace environments with options
    if (process.env.GIT_USER_NAME !== undefined && process.env.GIT_USER_EMAIL !== undefined) {
      const name = await this.git.getConfig('user.name')
      const email = await this.git.getConfig('user.email')
      await this.git.setConfig('user.name', process.env.GIT_USER_NAME)
      await this.git.setConfig('user.email', process.env.GIT_USER_EMAIL)
      await this.git.commit(message)
      await this.git.setConfig('user.name', name)
      await this.git.setConfig('user.email', email)
    } else {
      await this.git.commit(message)
    }
  }
}
