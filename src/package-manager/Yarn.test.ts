import type { Terminal } from '../terminal'
import { Yarn } from './Yarn'

describe('Yarn', () => {
  const terminalRunMock = jest.fn()
  const terminal = {
    run: terminalRunMock
  } as unknown as Terminal
  const yarn = new Yarn(terminal)

  afterEach(() => {
    terminalRunMock.mockReset()
  })

  // TODO: getVersions

  describe('install', () => {
    it('calls `yarn install`', async () => {
      await yarn.install()

      expect(terminalRunMock).toBeCalledWith('yarn', 'install')
    })
  })
})
