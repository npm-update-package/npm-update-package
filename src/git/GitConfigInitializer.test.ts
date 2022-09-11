import type { Options } from '../options'
import type { Git } from './Git'
import { GitConfigInitializer } from './GitConfigInitializer'

describe('GitConfigInitializer', () => {
  describe('initialize', () => {
    const setConfigMock = jest.fn()
    const git = {
      setConfig: setConfigMock
    } as unknown as Git

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('sets git user name if options.gitUserName exists', async () => {
      const options = {
        gitUserName: 'octocat'
      } as unknown as Options
      const gitConfigInitializer = new GitConfigInitializer({
        options,
        git
      })

      await gitConfigInitializer.initialize()

      expect(setConfigMock).toHaveBeenCalledWith('user.name', options.gitUserName)
    })

    it('sets git user email if options.gitUserEmail exists', async () => {
      const options = {
        gitUserEmail: 'octocat@example.com'
      } as unknown as Options
      const gitConfigInitializer = new GitConfigInitializer({
        options,
        git
      })

      await gitConfigInitializer.initialize()

      expect(setConfigMock).toHaveBeenCalledWith('user.email', options.gitUserEmail)
    })
  })
})
