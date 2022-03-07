import { Terminal } from '../terminal'
import { Yarn } from './Yarn'

describe('Yarn', () => {
  describe('install', () => {
    const terminalRunMock = jest.fn()
    const terminal = {
      run: terminalRunMock
    } as unknown as Terminal

    afterEach(() => {
      terminalRunMock.mockReset()
    })

    it('calls terminal.run()', async () => {
      const yarn = new Yarn(terminal)
      await yarn.install()

      expect(terminalRunMock).toBeCalledWith('yarn', 'install')
    })
  })
})
