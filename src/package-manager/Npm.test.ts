import { Terminal } from '../terminal'
import { Npm } from './Npm'

describe('Npm', () => {
  describe('install', () => {
    const terminalRunMock = jest.fn()
    const terminal = {
      run: terminalRunMock
    } as unknown as Terminal

    afterEach(() => {
      terminalRunMock.mockReset()
    })

    it('calls terminal.run()', async () => {
      const npm = new Npm(terminal)
      await npm.install()

      expect(terminalRunMock).toBeCalledWith('npm', 'install')
    })
  })
})
