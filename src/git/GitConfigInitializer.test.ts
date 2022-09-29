import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { Options } from '../options'
import type { Git } from './Git'
import { GitConfigInitializer } from './GitConfigInitializer'

describe('GitConfigInitializer', () => {
  describe('initialize', () => {
    const setConfigMock = jest.fn<Git['setConfig']>()
    const git = {
      setConfig: setConfigMock
    } as unknown as Git

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('sets git user name if options.gitUserName exists', async () => {
      const options = {
        gitUserName: 'octocat'
      }
      const gitConfigInitializer = new GitConfigInitializer({
        options: options as Options,
        git
      })

      await gitConfigInitializer.initialize()

      expect(setConfigMock).toHaveBeenCalledWith('user.name', options.gitUserName)
    })

    it('sets git user email if options.gitUserEmail exists', async () => {
      const options = {
        gitUserEmail: 'octocat@example.com'
      }
      const gitConfigInitializer = new GitConfigInitializer({
        options: options as Options,
        git
      })

      await gitConfigInitializer.initialize()

      expect(setConfigMock).toHaveBeenCalledWith('user.email', options.gitUserEmail)
    })
  })
})
