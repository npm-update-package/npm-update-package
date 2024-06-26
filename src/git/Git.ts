import type { Terminal } from '../terminal/Terminal.js'

export class Git {
  constructor (private readonly terminal: Terminal) {}

  async add (...files: string[]): Promise<void> {
    await this.terminal.run('git', 'add', ...files)
  }

  async commit (message: string): Promise<void> {
    await this.terminal.run('git', 'commit', '--message', message)
  }

  async createBranch (branchName: string): Promise<void> {
    await this.terminal.run('git', 'checkout', '-b', branchName)
  }

  async getRemoteUrl (): Promise<string> {
    const output = await this.terminal.run('git', 'remote', 'get-url', '--push', 'origin')
    return output.trim()
  }

  async push (branchName: string): Promise<void> {
    await this.terminal.run('git', 'push', 'origin', branchName)
  }

  async removeBranch (branchName: string): Promise<void> {
    await this.terminal.run('git', 'branch', '-D', branchName)
  }

  async restore (...files: string[]): Promise<void> {
    await this.terminal.run('git', 'checkout', ...files)
  }

  async setConfig (key: string, value: string): Promise<void> {
    await this.terminal.run('git', 'config', key, value)
  }

  async switch (branchName: string): Promise<void> {
    await this.terminal.run('git', 'checkout', branchName)
  }
}
