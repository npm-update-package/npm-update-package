import type { Terminal } from '../terminal'
import { GitRepository } from './GitRepository'

// TODO: add test
export class Git {
  constructor (private readonly terminal: Terminal) {}

  async add (...files: string[]): Promise<void> {
    await this.terminal.run('git', 'add', ...files)
  }

  async commit (message: string): Promise<void> {
    await this.terminal.run('git', 'commit', '--message', message)
  }

  async createBranch (branchName: string): Promise<void> {
    await this.terminal.run('git', 'switch', '-c', branchName)
  }

  async getConfig (key: string): Promise<string> {
    const { stdout } = await this.terminal.run('git', 'config', key)
    return stdout.trim()
  }

  async getCurrentBranch (): Promise<string> {
    const { stdout } = await this.terminal.run('git', 'rev-parse', '--abbrev-ref', 'HEAD')
    return stdout.trim()
  }

  async getRemoteUrl (): Promise<string> {
    const { stdout } = await this.terminal.run('git', 'remote', 'get-url', '--push', 'origin')
    return stdout.trim()
  }

  async getRepository (): Promise<GitRepository> {
    const url = await this.getRemoteUrl()
    return GitRepository.of(url)
  }

  async push (branchName: string): Promise<void> {
    await this.terminal.run('git', 'push', 'origin', branchName)
  }

  async removeBranch (branchName: string): Promise<void> {
    await this.terminal.run('git', 'branch', '-D', branchName)
  }

  async restore (...files: string[]): Promise<void> {
    await this.terminal.run('git', 'restore', '--worktree', '--staged', ...files)
  }

  async setConfig (key: string, value: string): Promise<void> {
    await this.terminal.run('git', 'config', key, value)
  }

  async switch (branchName: string): Promise<void> {
    await this.terminal.run('git', 'switch', branchName)
  }
}
