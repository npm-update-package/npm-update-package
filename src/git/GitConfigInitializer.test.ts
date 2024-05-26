import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import type { Options } from '../options/Options.js'
import type { Git } from './Git.js'
import { GitConfigInitializer } from './GitConfigInitializer.js'

await describe('GitConfigInitializer', async () => {
  await describe('initialize', async () => {
    await it('sets git user name if options.gitUserName exists', async ({ mock }) => {
      const setConfigMock = mock.fn<Git['setConfig']>()
      const git = {
        setConfig: setConfigMock
      } as unknown as Git
      const options = {
        gitUserName: 'octocat'
      } as unknown as Options
      const gitConfigInitializer = new GitConfigInitializer({
        options,
        git
      })

      await gitConfigInitializer.initialize()

      assert.strictEqual(setConfigMock.mock.callCount(), 1)
      assert.deepStrictEqual(setConfigMock.mock.calls.map(call => call.arguments), [
        ['user.name', options.gitUserName]
      ])
    })

    await it('sets git user email if options.gitUserEmail exists', async ({ mock }) => {
      const setConfigMock = mock.fn<Git['setConfig']>()
      const git = {
        setConfig: setConfigMock
      } as unknown as Git
      const options = {
        gitUserEmail: 'octocat@example.com'
      } as unknown as Options
      const gitConfigInitializer = new GitConfigInitializer({
        options,
        git
      })

      await gitConfigInitializer.initialize()

      assert.strictEqual(setConfigMock.mock.callCount(), 1)
      assert.deepStrictEqual(setConfigMock.mock.calls.map(call => call.arguments), [
        ['user.email', options.gitUserEmail]
      ])
    })
  })
})
