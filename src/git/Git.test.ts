import assert from 'node:assert'
import {
  afterEach,
  describe,
  it,
  mock
} from 'node:test'
import type { Terminal } from '../terminal/Terminal.js'
import { Git } from './Git.js'

await describe('Git', async () => {
  const runMock = mock.fn<Terminal['run']>()
  const terminal = {
    run: runMock
  } as unknown as Terminal
  const git = new Git(terminal)

  afterEach(() => {
    runMock.mock.resetCalls()
  })

  await describe('add', async () => {
    await it('calls `git add <files>`', async () => {
      const files = [
        'package.json',
        'package-lock.json'
      ]

      await git.add(...files)

      assert.strictEqual(runMock.mock.callCount(), 1)
      assert.deepStrictEqual(runMock.mock.calls.map(call => call.arguments), [
        ['git', 'add', ...files]
      ])
    })
  })

  await describe('commit', async () => {
    await it('calls `git commit --message <message>`', async () => {
      const message = 'test message'

      await git.commit(message)

      assert.strictEqual(runMock.mock.callCount(), 1)
      assert.deepStrictEqual(runMock.mock.calls.map(call => call.arguments), [
        ['git', 'commit', '--message', message]
      ])
    })
  })

  await describe('createBranch', async () => {
    await it('calls `git checkout -b <branchName>`', async () => {
      const branchName = 'test-branch-name'

      await git.createBranch(branchName)

      assert.strictEqual(runMock.mock.callCount(), 1)
      assert.deepStrictEqual(runMock.mock.calls.map(call => call.arguments), [
        ['git', 'checkout', '-b', branchName]
      ])
    })
  })

  await describe('getRemoteUrl', async () => {
    await it('calls `git remote get-url --push origin`', async () => {
      const expected = 'https://github.com/npm-update-package/example.git'
      runMock.mock.mockImplementation(() => expected)

      const actual = await git.getRemoteUrl()

      assert.strictEqual(actual, expected)
      assert.strictEqual(runMock.mock.callCount(), 1)
      assert.deepStrictEqual(runMock.mock.calls.map(call => call.arguments), [
        ['git', 'remote', 'get-url', '--push', 'origin']
      ])
    })
  })

  await describe('push', async () => {
    await it('calls `git push origin <branchName>`', async () => {
      const branchName = 'test-branch-name'

      await git.push(branchName)

      assert.strictEqual(runMock.mock.callCount(), 1)
      assert.deepStrictEqual(runMock.mock.calls.map(call => call.arguments), [
        ['git', 'push', 'origin', branchName]
      ])
    })
  })

  await describe('removeBranch', async () => {
    await it('calls `git branch -D <branchName>`', async () => {
      const branchName = 'test-branch-name'

      await git.removeBranch(branchName)

      assert.strictEqual(runMock.mock.callCount(), 1)
      assert.deepStrictEqual(runMock.mock.calls.map(call => call.arguments), [
        ['git', 'branch', '-D', branchName]
      ])
    })
  })

  await describe('restore', async () => {
    await it('calls `git checkout <files>`', async () => {
      const files = [
        'package.json',
        'package-lock.json'
      ]

      await git.restore(...files)

      assert.strictEqual(runMock.mock.callCount(), 1)
      assert.deepStrictEqual(runMock.mock.calls.map(call => call.arguments), [
        ['git', 'checkout', ...files]
      ])
    })
  })

  await describe('setConfig', async () => {
    await it('calls `git config <key> <value>`', async () => {
      const key = 'user.name'
      const value = 'octocat'

      await git.setConfig(key, value)

      assert.strictEqual(runMock.mock.callCount(), 1)
      assert.deepStrictEqual(runMock.mock.calls.map(call => call.arguments), [
        ['git', 'config', key, value]
      ])
    })
  })

  await describe('switch', async () => {
    await it('calls `git checkout <branchName>`', async () => {
      const branchName = 'test-branch-name'

      await git.switch(branchName)

      assert.strictEqual(runMock.mock.callCount(), 1)
      assert.deepStrictEqual(runMock.mock.calls.map(call => call.arguments), [
        ['git', 'checkout', branchName]
      ])
    })
  })
})
