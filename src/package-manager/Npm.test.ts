import type { Terminal } from '../terminal'
import { Npm } from './Npm'

describe('Npm', () => {
  const terminalRunMock = jest.fn()
  const terminal = {
    run: terminalRunMock
  } as unknown as Terminal
  const npm = new Npm(terminal)

  afterEach(() => {
    terminalRunMock.mockReset()
  })

  describe('install', () => {
    it('calls `npm install', async () => {
      await npm.install()

      expect(terminalRunMock).toBeCalledWith('npm', 'install')
    })
  })
})
