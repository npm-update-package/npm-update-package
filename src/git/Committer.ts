import type { Git } from './Git'

export interface User {
  name?: string
  email?: string
}

// TODO: add test
export class Committer {
  private readonly git: Git
  private readonly user: User | undefined

  constructor ({
    git,
    user
  }: {
    git: Git
    user?: User
  }) {
    this.git = git
    this.user = user
  }

  async commit (message: string): Promise<void> {
    let name: string | undefined

    if (this.user?.name !== undefined) {
      name = await this.git.getConfig('user.name')
      await this.git.setConfig('user.name', this.user.name)
    }

    let email: string | undefined

    if (this.user?.email !== undefined) {
      email = await this.git.getConfig('user.email')
      await this.git.setConfig('user.email', this.user.email)
    }

    await this.git.commit(message)

    if (name !== undefined) {
      await this.git.setConfig('user.name', name)
    }

    if (email !== undefined) {
      await this.git.setConfig('user.email', email)
    }
  }
}
