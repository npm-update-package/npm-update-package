import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { ExecaReturnValue } from 'execa'
import type { Terminal } from '../../terminal'
import { Npm } from './Npm'

describe('Npm', () => {
  const terminalRunMock = jest.fn<Terminal['run']>()
  const terminal = {
    run: terminalRunMock
  } as unknown as Terminal
  const npm = new Npm(terminal)

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getVersions', () => {
    describe('calls `npm info <package-name> versions --json', () => {
      const packageName = '@npm-update-package/example'

      it('returns versions if stdout is valid', async () => {
        const expected = [
          '1.0.0',
          '2.0.0'
        ]
        terminalRunMock.mockResolvedValue({ stdout: JSON.stringify(expected) } as unknown as ExecaReturnValue)

        const actual = await npm.getVersions(packageName)

        expect(actual).toEqual(expected)
        expect(terminalRunMock).toHaveBeenCalledWith('npm', 'info', packageName, 'versions', '--json')
      })

      it('throws error if stdout is invalid', async () => {
        terminalRunMock.mockResolvedValue({ stdout: JSON.stringify({}) } as unknown as ExecaReturnValue)

        await expect(async () => await npm.getVersions(packageName)).rejects.toThrow(Error)

        expect(terminalRunMock).toHaveBeenCalledWith('npm', 'info', packageName, 'versions', '--json')
      })
    })
  })

  describe('install', () => {
    it('calls `npm install', async () => {
      await npm.install()

      expect(terminalRunMock).toHaveBeenCalledWith('npm', 'install')
    })
  })
})
