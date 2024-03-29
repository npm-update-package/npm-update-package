import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { ExecaReturnValue } from 'execa'
import type { Terminal } from '../terminal'
import { Git } from './Git'

describe('Git', () => {
  const terminalRunMock = jest.fn<Terminal['run']>()
  const terminal = {
    run: terminalRunMock
  } as unknown as Terminal
  const git = new Git(terminal)

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('add', () => {
    it('calls `git add <files>`', async () => {
      const files = [
        'package.json',
        'package-lock.json'
      ]

      await git.add(...files)

      expect(terminalRunMock).toHaveBeenCalledWith('git', 'add', ...files)
    })
  })

  describe('commit', () => {
    it('calls `git commit --message <message>`', async () => {
      const message = 'test message'

      await git.commit(message)

      expect(terminalRunMock).toHaveBeenCalledWith('git', 'commit', '--message', message)
    })
  })

  describe('createBranch', () => {
    it('calls `git checkout -b <branchName>`', async () => {
      const branchName = 'test-branch-name'

      await git.createBranch(branchName)

      expect(terminalRunMock).toHaveBeenCalledWith('git', 'checkout', '-b', branchName)
    })
  })

  describe('getRemoteUrl', () => {
    it('calls `git remote get-url --push origin`', async () => {
      const expected = 'https://github.com/npm-update-package/example.git'
      terminalRunMock.mockResolvedValue({ stdout: expected } as unknown as ExecaReturnValue)

      const actual = await git.getRemoteUrl()

      expect(actual).toBe(expected)
      expect(terminalRunMock).toHaveBeenCalledWith('git', 'remote', 'get-url', '--push', 'origin')
    })
  })

  describe('push', () => {
    it('calls `git push origin <branchName>`', async () => {
      const branchName = 'test-branch-name'

      await git.push(branchName)

      expect(terminalRunMock).toHaveBeenCalledWith('git', 'push', 'origin', branchName)
    })
  })

  describe('removeBranch', () => {
    it('calls `git branch -D <branchName>`', async () => {
      const branchName = 'test-branch-name'

      await git.removeBranch(branchName)

      expect(terminalRunMock).toHaveBeenCalledWith('git', 'branch', '-D', branchName)
    })
  })

  describe('restore', () => {
    it('calls `git checkout <files>`', async () => {
      const files = [
        'package.json',
        'package-lock.json'
      ]

      await git.restore(...files)

      expect(terminalRunMock).toHaveBeenCalledWith('git', 'checkout', ...files)
    })
  })

  describe('setConfig', () => {
    it('calls `git config <key> <value>`', async () => {
      const key = 'user.name'
      const value = 'octocat'

      await git.setConfig(key, value)

      expect(terminalRunMock).toHaveBeenCalledWith('git', 'config', key, value)
    })
  })

  describe('switch', () => {
    it('calls `git checkout <branchName>`', async () => {
      const branchName = 'test-branch-name'

      await git.switch(branchName)

      expect(terminalRunMock).toHaveBeenCalledWith('git', 'checkout', branchName)
    })
  })
})
